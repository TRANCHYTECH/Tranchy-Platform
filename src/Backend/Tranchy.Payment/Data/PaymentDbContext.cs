using MassTransit;
using Microsoft.EntityFrameworkCore;

namespace Tranchy.Payment.Data;

public class PaymentDbContext : DbContext
{
    public const string DbSchema = "payment";

    public DbSet<Deposit> Deposits => Set<Deposit>();

    public PaymentDbContext(DbContextOptions options) : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.HasDefaultSchema(DbSchema);
        modelBuilder.ApplyConfiguration(new DepositEntityTypeConfiguration());

        modelBuilder.AddInboxStateEntity();
        modelBuilder.AddOutboxStateEntity();
        modelBuilder.AddOutboxMessageEntity();
    }
}
