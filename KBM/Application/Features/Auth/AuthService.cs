using Application.Common;
using Application.Features.Auth.DTO;
using Domain.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;

namespace Application.Features.Auth
{
    public class AuthService : IAuthService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IJwtTokenGenerator _tokenGenerator;
        private readonly ILogger<AuthService> _logger;

        public AuthService(UserManager<ApplicationUser> userManager, IJwtTokenGenerator tokenGenerator, ILogger<AuthService> logger)
        {
            _userManager = userManager;
            _tokenGenerator = tokenGenerator;
            _logger = logger;
        }

        public async Task<AuthResponseDto> RegisterAsync(RegisterDto dto)
        {
            if (await _userManager.FindByEmailAsync(dto.Email) is not null)
                return new AuthResponseDto { Message = "Email already registered.", IsAuthenticated = false };

            var user = new ApplicationUser { UserName = dto.Email, Email = dto.Email, FirstName = dto.Name };

            var result = await _userManager.CreateAsync(user, dto.Password);
            if (!result.Succeeded)
            {
                _logger.LogWarning("Registration failed for {Email}: {Errors}", dto.Email, string.Join("; ", result.Errors.Select(e => e.Description)));
                return new AuthResponseDto
                {
                    Message = string.Join("; ", result.Errors.Select(e => e.Description)), IsAuthenticated = false
                };
            }

            var (token, expiresOn) = _tokenGenerator.GenerateToken(user, new List<string>());
            return new AuthResponseDto
            {
                IsAuthenticated = true,
                Message = "Registered successfully.",
                Name = user.FirstName,
                Email = user.Email!,
                Token = token,
                ExpiresOn = expiresOn
            };
        }

        public async Task<AuthResponseDto> LoginAsync(LoginDto dto)
        {
            var user = await _userManager.FindByEmailAsync(dto.Email);
            if (user is null || !await _userManager.CheckPasswordAsync(user, dto.Password))
                return new AuthResponseDto { Message = "Invalid email or password.", IsAuthenticated = false };

            var roles = await _userManager.GetRolesAsync(user);
            var (token, expiresOn) = _tokenGenerator.GenerateToken(user, roles);
            return new AuthResponseDto
            {
                IsAuthenticated = true,
                Message = "Login successful.",
                Name = user.FirstName,
                Email = user.Email!,
                Token = token,
                ExpiresOn = expiresOn
            };
        }
    }
}