using Domain.Entities;

namespace Application.Common
{
    public interface IJwtTokenGenerator
    {
        (string Token, DateTime ExpiresOn) GenerateToken(ApplicationUser user, IList<string> roles);
    }
}