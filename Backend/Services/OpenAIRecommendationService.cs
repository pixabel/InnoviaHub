using System.Text.Json;
using System.Text;

namespace Backend.Services
{
    public class OpenAIRecommendationService
    {
        private readonly IConfiguration _config;
        private readonly IHttpClientFactory _httpClientFactory;

        public OpenAIRecommendationService(IConfiguration config, IHttpClientFactory httpClientFactory)
        {
            _config = config;
            _httpClientFactory = httpClientFactory;
        }
        
        // method to get recommendation based on user history 
        public async Task<string> GetRecommendationAsync(object historyData)
        {
            string? apiKey = _config["OpenAI:ApiKey"];
            if (string.IsNullOrWhiteSpace(apiKey))
                throw new InvalidOperationException("OpenAI API key is not configured.");

            // promt only gives certain hours for recommendation and instructs to only reply with JSON
            // also instructs to avoid repeating previous recommendations
            // and to suggest different resources if user has booked or been recommended the same resource often
            // also instructs to write the message in Swedish
            // time format is also specified to be swedish local time (Europe/Stockholm)
            // the time string format is also specified
            var prompt = 
                "Given the following user booking history, reply ONLY with a JSON object in this format: " +
                "{ \"resource\": \"string\", \"date\": \"string\", \"time\": \"string\", \"message\": \"string\" } " +
                "Do not include any explanation or text outside the JSON. " +
                "Only suggest booking times that start between 07:00 and 18:00, in Swedish local time (Europe/Stockholm). " +
                "The time string must use the format \"HH:mm - HH:mm\" and should always be between 07:00 and 18:00. " +
                "For example: \"07:00 - 09:00\", \"13:00 - 15:00\". " +
                "The message should be in Swedish, like 'Baserat på dina tidigare bokningar!'. " +
                "User booking history:\n" +
                "You should suggest bookings for different types of resources based on their past patterns.\n" +
                "If you have already recommended a resource recently or booked it often, try to recommend a different resource for variety.\n" +
                "If the user asks for another suggestion, try to recommend a different resource or time than previously suggested. " +
                "If any previous recommendations are provided, try not to repeat them." +
                JsonSerializer.Serialize(historyData);

            var requestObject = new
            {
                model = "gpt-3.5-turbo",
                messages = new[]
                {
                    new { role = "system", content = "You are an assistant helping users book resources more intelligently based on past patterns." },
                    new { role = "user", content = prompt },
                },
                temperature = 0.7
            }; 

            var json = JsonSerializer.Serialize(requestObject);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            var client = _httpClientFactory.CreateClient();
            client.BaseAddress = new Uri("https://api.openai.com/v1/");
            client.DefaultRequestHeaders.Authorization =
                new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", apiKey);

            var response = await client.PostAsync("chat/completions", content);
            response.EnsureSuccessStatusCode();

            var responseString = await response.Content.ReadAsStringAsync();

            using var doc = JsonDocument.Parse(responseString);
            var recommendation = doc.RootElement
                                    .GetProperty("choices")[0]
                                    .GetProperty("message")
                                    .GetProperty("content")
                                    .GetString();

            return recommendation ?? "Ingen rekommendation kunde genereras.";
        }

    }
}