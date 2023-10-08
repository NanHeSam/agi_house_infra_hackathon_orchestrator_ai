from pydantic import BaseModel, Field

class Agent(BaseModel):
    agent_name: str = Field(..., description="Name of the agent, must be unique")
    agent_url: str = Field(..., )
    endpoint: str = Field(...)
    description: str = Field(...)
    metadata: dict = Field(default={})
    icon: str = Field(...)

class LLMFormattedAgentResponse(BaseModel):
    agent_name: str = Field(...)
    goal: str = Field(...)

class FindAgentRequest(BaseModel):
    instruction: str = Field(...)
    context: str = Field(...)

class FindAgentSingleResponse(BaseModel):
    agent: Agent = Field(...)
    goal: str = Field(...)

class FindAgentResponse(BaseModel):
    agents: list[FindAgentSingleResponse] = Field(default=[])

class RegisterAgentResponse(BaseModel):
    message: str

class RegisterAgentRequest(BaseModel):
    agent: Agent
