using System.Security.Claims;
using Microsoft.AspNetCore.Http;

namespace Tranchy.Common.Services;

public class Tenant(IHttpContextAccessor httpContextAccessor) : ITenant
{
    public string Email => GetClaim(ClaimTypes.Email);

    public string UserId => GetClaim(ClaimTypes.NameIdentifier);

    private IEnumerable<Claim> Claims => httpContextAccessor?.HttpContext?.User?.Claims ?? Array.Empty<Claim>();

    private string GetClaim(string claimType)
    {
        var claim = Claims.FirstOrDefault(c => string.Equals(c.Type, claimType, StringComparison.Ordinal));
        return claim?.Value ?? string.Empty;
    }
}
