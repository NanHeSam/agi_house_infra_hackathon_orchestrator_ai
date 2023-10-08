
import re
from app.models.agent_model import LLMFormattedAgentResponse

# # Regular expression patterns
tool_pattern = r'Tool:\s*(.*?)\n'
goal_pattern = r'Goal:\s*(.*?)\n'


class FindAgentResultParser:

    @classmethod
    def parse(cls, text: str) -> list[LLMFormattedAgentResponse]:
        # # Extract the values using the patterns
        print(f'parsing: {text}')
        tools = re.findall(tool_pattern, text)
        goals = re.findall(goal_pattern, text)
        results = [{'agent_name': tool, 'goal': goal} for tool, goal in zip(tools, goals)]
        return [LLMFormattedAgentResponse(**item) for item in results]

    @classmethod
    def parse_to_tasks(cls, text: str) -> list[str]:
        pattern = re.compile(r'^[Ss]tep\d+: (.+)', re.MULTILINE)
        return [match.group(1).strip() for match in pattern.finditer(text)]
