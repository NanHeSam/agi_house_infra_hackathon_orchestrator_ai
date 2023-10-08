import os

import pinecone
from langchain.prompts import PromptTemplate
from llama_index.storage.storage_context import StorageContext
from llama_index.vector_stores import PineconeVectorStore
from llama_index.llms import OpenAI

from llama_index import (
  VectorStoreIndex,
  LLMPredictor,
  ServiceContext
)

from trulens_eval import TruLlama, Feedback, Tru
from trulens_eval.feedback import GroundTruthAgreement, Groundedness

from app.agent.template import EXPLAIN_MATCHING_PROMPT
from app.models.agent_model import Agent, FindAgentSingleResponse

from dotenv import load_dotenv, find_dotenv
_ = load_dotenv(find_dotenv())

class LlamaIndexAgent:

  def __init__(self):

    index_name = 'index-v3'


    vector_store = PineconeVectorStore(
        pinecone_index=index_name,
        environment=os.environ["PINECONE_ENVIRONMENT"]
    )

    storage_context = StorageContext.from_defaults(vector_store=vector_store)

    # set service context
    llm = OpenAI(temperature=0, model="gpt-3.5-turbo")
    service_context = ServiceContext.from_defaults(llm=llm)


    self.query_engine = index.as_query_engine()

  def query(self, task: str):

    query_template = PromptTemplate(
        template=EXPLAIN_MATCHING_PROMPT,
        input_variables=['task']
    )
    prompt = query_template.format(task=task)

    response = self.query_engine.query(prompt)
    node = response.source_nodes[0]
    agent = Agent(**(node.metadata | {'description': node.text}))

    return FindAgentSingleResponse(agent=agent, goal=response.response)


if __name__ == "__main__":

  # tru = Tru()

  agent = LlamaIndexAgent()
  resp = agent.query("I want plan a trip to europe")
  print(resp)
  print('done')
