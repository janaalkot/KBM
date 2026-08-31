using Application.Features.Auth;
using Application.Features.Service.Lessons;
using Application.Features.Service.Lessons.DTO;
using Application.Features.Service.Lookups;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Reflection;
using System.Text;


namespace Application
{
    public static class DI
    {
        public static IServiceCollection AddApplication(
            this IServiceCollection services)
        {
            services.AddScoped<ILessonService, LessonService>();
            services.AddScoped<IAuthService, AuthService>();
            services.AddScoped<ILookupService, LookupService>();

            return services;
        }
    }
}
