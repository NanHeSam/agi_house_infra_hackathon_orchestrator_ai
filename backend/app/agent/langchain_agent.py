import os
import openai
from app.agent.constants import LLM_MODEL
from langchain.llms import OpenAI
from langchain.chains import ConversationChain
from app.agent.template import TASK_BREAKDOWN_PROMPT, SIMPLE_TASK_BREAKDOWN_PROMPT, FIND_REASON_PROMPT
from typing import Sequence
from app.models.agent_model import Agent
from langchain.memory import ConversationSummaryBufferMemory
from langchain.prompts import PromptTemplate

from dotenv import load_dotenv, find_dotenv
_ = load_dotenv(find_dotenv()) # read local .env file
openai.api_key = os.environ['OPENAI_API_KEY']

class LangChainAgent:
    def __init__(self):
        self.llm = OpenAI(temperature=0.0)

    @classmethod
    def create_prompt_template(
        cls,
        agents: Sequence[Agent],
    ) -> PromptTemplate:
        tool_description_str = "\n".join([f"{tool.agent_name}: {tool.description}" for tool in agents])
        tool_names = ", ".join([tool.agent_name for tool in agents])
        input_variables = ["input"]
        return PromptTemplate(
            template=TASK_BREAKDOWN_PROMPT,
            input_variables=input_variables,
            partial_variables={
                "tool_descriptions":tool_description_str, "tool_names": tool_names
            })

    def create_simple_prompt(self, prompt, input_var):
        return PromptTemplate(template=prompt, input_variables=input_var)

    def call_predict(self, prompt: str) -> str:
        return self.llm(prompt)
    
    def query_result(self, user_query: str, agents: Sequence[Agent]) -> str:
        query_template = self.create_prompt_template(agents)
        prompt = query_template.format(input=user_query)
        output = self.llm(prompt)
        return output

    def query_simple_tasks_breakdown(self, instruction, context):
        prompt_template = PromptTemplate(template=SIMPLE_TASK_BREAKDOWN_PROMPT, input_variables=['input', 'preference'])
        prompt = prompt_template.format(input=instruction, preference=context)
        return self.llm(prompt)
        
    def query_find_reason(self, tool_description, task_description):
        prompt_template = PromptTemplate(template=FIND_REASON_PROMPT, input_variables=['tool_description', 'task_description'])
        prompt = prompt_template.format(tool_description=tool_description, task_description=task_description)
        return self.llm(prompt)
