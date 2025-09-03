using System.Net;
using System.Net.Mail;
using Microsoft.Extensions.Options;

namespace BookLibrary.Services.Email
{
    public class EmailService
    {
        private readonly SmtpSettings _smtp;

        public EmailService(IOptions<SmtpSettings> smtpOptions)
        {
            _smtp = smtpOptions.Value;
        }

        public async Task SendAsync(string to, string subject, string body, bool isHtml = true)
        {
            using var client = new SmtpClient(_smtp.Host, _smtp.Port)
            {
                EnableSsl = _smtp.EnableSsl,
                Credentials = new NetworkCredential(_smtp.Username, _smtp.Password)
            };

            var mail = new MailMessage(_smtp.From, to, subject, body) { IsBodyHtml = isHtml };
            await client.SendMailAsync(mail);
        }
    }
}
