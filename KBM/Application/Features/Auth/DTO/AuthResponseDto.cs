using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Features.Auth.DTO
{
    public class AuthResponseDto
    {

        public string Message { get; set; } = string.Empty;
        public bool IsAuthenticated { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Token { get; set; } = string.Empty;
        public DateTime ExpiresOn { get; set; }
    }
}
