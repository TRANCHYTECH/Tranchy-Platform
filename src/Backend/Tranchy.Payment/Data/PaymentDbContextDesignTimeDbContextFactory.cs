using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace Tranchy.Payment.Data;

public class PaymentDbContextDesignTimeDbContextFactory : IDesignTimeDbContextFactory<PaymentDbContext>
{
    public PaymentDbContext CreateDbContext(string[] args)
    {
        var options = new DbContextOptionsBuilder<PaymentDbContext>().UseSqlServer("Data Source=Dummy").Options;

        return new(options);
    }
}
