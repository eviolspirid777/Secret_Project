namespace SecretProject.User.Data.DataStore.Entities
{
    public sealed class UserProfile 
    {
        public required Guid Id { get; set; }
        public required string Name { get; set; }
        public required PresenceState PresenceState { get; set; }
        public required ActivationState ActivationState { get; set; }
        public required DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public DateTime? DeletedAt { get; set; }
        public Guid? AvatarFileId { get; set; }
        public string? Bio {  get; set; }
        public DateTime? LastSeenAt { get; set; }
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
