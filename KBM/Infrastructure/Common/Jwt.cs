using System;
using System.Collections.Generic;
using System.Text;

namespace Infrastructure.Common
{
    public class Jwt
    {

        public string Key { get; set; } = string.Empty;
        public string Issuer { get; set; } = string.Empty;
        public string Audience { get; set; } = string.Empty;
        public double DurationInMinutes { get; set; }
    }
}
