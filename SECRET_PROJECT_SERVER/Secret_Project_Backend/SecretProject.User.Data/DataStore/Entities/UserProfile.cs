namespace SecretProject.User.Data.DataStore.Entities
{
    public sealed class UserProfile 
    {
        public required Guid Id { get; set; }
        public required string Name { get; set; }
        public required PresenceState PresenceState { get; set; }
        public required ActivationState ActivationState { get; set; }
        public required DateTimeOffset CreatedAt { get; set; }
        public DateTimeOffset? UpdatedAt { get; set; }
        public DateTimeOffset? DeletedAt { get; set; }
        public Guid? AvatarFileId { get; set; }
        public string? Bio {  get; set; }
        public DateTimeOffset? LastSeenAt { get; set; }
    }

    public enum PresenceState
    {
        Online,
        Offline,
        Sleeping,
        Invisible
    }

    public enum ActivationState
    {
        Pending,
        Confirmed
    }
}
