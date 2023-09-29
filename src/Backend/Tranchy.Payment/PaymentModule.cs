using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Tranchy.Common;
using Tranchy.Payment.Data;

namespace Tranchy.Payment;

public class PaymentModule : IModule
{
    public static void ConfigureServices(IServiceCollection services, AppSettings configuration)
    {
        services.AddPooledDbContextFactory<PaymentDbContext>(SetupDbContext)
                .AddScoped(provider => provider.GetRequiredService<IDbContextFactory<PaymentDbContext>>().CreateDbContext());
    }

    private static void SetupDbContext(IServiceProvider serviceProvider, DbContextOptionsBuilder options)
    {
        var connectionString = serviceProvider.GetRequiredService<IConfiguration>().GetValue<string>("PaymentDb:ConnectionString");
        options.UseSqlServer(connectionString, sqlOptions =>
        {
            sqlOptions.EnableRetryOnFailure(3);
            sqlOptions.MigrationsHistoryTable("__EFMigrationsHistory", PaymentDbContext.DbSchema);
            sqlOptions.MigrationsAssembly(typeof(PaymentDbContext).Assembly.FullName);
        });

        if (serviceProvider.GetRequiredService<IHostEnvironment>().IsDevelopment())
        {
            options.EnableSensitiveDataLogging().EnableDetailedErrors();
        }
    }
}

