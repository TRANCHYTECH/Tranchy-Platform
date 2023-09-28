using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Tranchy.Common;

namespace Tranchy.Payment;

public class PaymentModule : IModule
{
    public static void ConfigureServices(IServiceCollection services, IConfigurationSection configuration)
    {
    }
}

