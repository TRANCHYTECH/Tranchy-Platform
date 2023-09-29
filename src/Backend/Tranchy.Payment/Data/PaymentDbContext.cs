using MassTransit;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Tranchy.Payment.Data
{
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

    public class DepositEntityTypeConfiguration : IEntityTypeConfiguration<Deposit>
    {
        public void Configure(EntityTypeBuilder<Deposit> builder)
        {
            builder.HasKey(a => a.Id);
        }
    }

    public class Deposit
    {
        public int Id { get; set; }
        public required string QuestionId { get; set; }
        public required double Amount { get; set; }
        public required string Status { get; set; }
    }

    public class PaymentDbContextDesignTimeDbContextFactory : IDesignTimeDbContextFactory<PaymentDbContext>
    {
        public PaymentDbContext CreateDbContext(string[] args)
        {
            var options = new DbContextOptionsBuilder<PaymentDbContext>().UseSqlServer("Data Source=Dummy").Options;

            return new(options);
        }
    }
}
