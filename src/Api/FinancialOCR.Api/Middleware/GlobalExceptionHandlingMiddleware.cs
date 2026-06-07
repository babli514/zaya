using System.Net;
using System.Text.Json;
using Serilog;

namespace FinancialOCR.Api.Middleware;

public class GlobalExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;

    public GlobalExceptionHandlingMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            await HandleExceptionAsync(context, ex);
        }
    }

    private static Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        Log.Error(exception, "An unhandled exception occurred");

        context.Response.ContentType = "application/json";
        context.Response.StatusCode = HttpStatusCode.InternalServerError.GetHashCode();

        var response = new
        {
            statusCode = context.Response.StatusCode,
            message = "An error occurred while processing your request",
            detail = exception.Message
        };

        return context.Response.WriteAsJsonAsync(response);
    }
}
