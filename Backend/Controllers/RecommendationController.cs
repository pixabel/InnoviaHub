using Microsoft.AspNetCore.Mvc;
using Backend.Services;
using System.Text.Json;

namespace InnoviaHub.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RecommendationController : ControllerBase
    {
        private readonly OpenAIRecommendationService _recommendationService;

        public RecommendationController(OpenAIRecommendationService recommendationService)
        {
            _recommendationService = recommendationService;
        }

        [HttpPost("suggest")]
        public async Task<IActionResult> GetRecommendation([FromBody] object historyData)
        {
            if (historyData == null)
                return BadRequest("History data is required.");

            try
            {
                // Call the AI service with user history
                var aiResult = await _recommendationService.GetRecommendationAsync(historyData);

                object recommendation;

                try
                {
                    // Try to parse the AI result as JSON (should succeed if prompt is strict)
                    recommendation = JsonSerializer.Deserialize<JsonElement>(aiResult);
                }
                catch
                {
                    // If parsing fails, treat the whole response as a message
                    recommendation = new
                    {
                        resource = "",
                        date = "",
                        time = "",
                        message = aiResult.Trim()
                    };
                }

                return Ok(new { recommendation });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred while processing the recommendation: {ex.Message}");
            }
        }
    }
}