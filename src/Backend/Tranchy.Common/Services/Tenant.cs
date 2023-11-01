using System.Security.Claims;
using Microsoft.AspNetCore.Http;

namespace Tranchy.Common.Services;

public class Tenant : ITenant
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    public Tenant(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }

    public string Email => GetClaim(ClaimTypes.Email);

    public string UserId => GetClaim(ClaimTypes.NameIdentifier);

    private IEnumerable<Claim> Claims => _httpContextAccessor?.HttpContext?.User?.Claims ?? Array.Empty<Claim>();

    private string GetClaim(string claimType)
    {
        var claim = Claims.FirstOrDefault(c => string.Equals(c.Type, claimType, StringComparison.Ordinal));
        return claim?.Value ?? string.Empty;
    }
}
