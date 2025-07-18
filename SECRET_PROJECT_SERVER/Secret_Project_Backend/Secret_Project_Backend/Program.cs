using System.IdentityModel.Tokens.Jwt;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Secret_Project_Backend.Configurations;
using Secret_Project_Backend.Context;
using Secret_Project_Backend.Models;
using static Secret_Project_Backend.Configurations.ServiceExtensions;
using Secret_Project_Backend.Services;
using Secret_Project_Backend.SignalR;
using Microsoft.AspNetCore.SignalR;
using Secret_Project_Backend.Services.Chat;
using Secret_Project_Backend.Services.Status;
using Secret_Project_Backend.Services.User;
using Secret_Project_Backend.Services.S3;
using Secret_Project_Backend.Services.ChannelChat;
using Microsoft.AspNetCore.ResponseCompression;
using Microsoft.AspNetCore.RateLimiting;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
        Description = "Введите JWT токен"
    });

    options.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
    {
        {
            new Microsoft.OpenApi.Models.OpenApiSecurityScheme
            {
                Reference = new Microsoft.OpenApi.Models.OpenApiReference
                {
                    Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    });
});

builder.Services.AddCorsService(CORS_ENUM.ANY);
builder.Services.AddSignalR();

builder.Services.AddDbService<PostgreSQLDbContext>(builder.Configuration.GetConnectionString("Development"));
builder.Services.AddIdentity<ApplicationUser, IdentityRole>(options =>
{
    options.Password.RequireDigit = true;
    options.Password.RequireUppercase = false;
    options.Password.RequiredLength = 6;
    options.Password.RequireNonAlphanumeric = false;
})
.AddEntityFrameworkStores<PostgreSQLDbContext>()
.AddDefaultTokenProviders();

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
    };
    options.Events = new JwtBearerEvents
    {
        OnMessageReceived = context =>
        {
            foreach (var kv in context.Request.Query)
            {
                Console.WriteLine($"Query: {kv.Key} = {kv.Value}");
            }
            var accessToken = context.Request.Query["access_token"];
            var path = context.HttpContext.Request.Path;
            if (!string.IsNullOrEmpty(accessToken) && 
                (
                    path.StartsWithSegments("/chatHub") ||
                    path.StartsWithSegments("/friendHub") ||
                    path.StartsWithSegments("/statusHub") ||
                    path.StartsWithSegments("/channelMessagesHub")
                ))
            {
                context.Token = accessToken;
            }
            return Task.CompletedTask;
        }
    };
});

builder.Services.AddResponseCompression(options =>
{
    options.Providers.Add<BrotliCompressionProvider>();
    options.EnableForHttps = true;
});
builder.Services.Configure<BrotliCompressionProviderOptions>(options =>
{
    options.Level = System.IO.Compression.CompressionLevel.Fastest;
});

builder.Services.AddRateLimiter(options =>
{
    options.AddConcurrencyLimiter("Autorize", options =>
    {
        options.PermitLimit = 10;
        options.QueueLimit = 0;
        options.QueueProcessingOrder = System.Threading.RateLimiting.QueueProcessingOrder.OldestFirst;
    });
});

builder.Services.AddSingleton<IUserIdProvider, NameUserIdProvider>();
builder.Services.AddScoped<IEmailService, MailKitEmailService>();
builder.Services.AddScoped<UserService>();
builder.Services.AddScoped<ChangeUserStatusService>();
builder.Services.AddScoped<MessageService>();

builder.Services.AddScoped<ChannelChatSignlaRService>();

builder.Services.AddScoped<S3ServiceMessages>();
builder.Services.AddScoped<S3ServiceAvatars>();

var app = builder.Build();

app.UseCors("AllowSpecificOrigin");

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseResponseCompression();
app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.MapHub<ChatHub>("/chatHub");
app.MapHub<ChannelMessagesHub>("/channelMessagesHub");
app.MapHub<FriendRequestHub>("/friendHub");
app.MapHub<StatusHub>("/statusHub");

app.Run();