import boto3
from boto3.dynamodb.conditions import Key
from datetime import datetime

# Connect to DynamoDB
dynamodb = boto3.resource('dynamodb', region_name='us-west-2')

# Get the table
table = dynamodb.Table('AgentsRegistry')

def agent_exists(agent_name: str) -> bool:
    """
    Function to check if an agent with the given name exists in the DynamoDB table
    """
    response = table.query(
        KeyConditionExpression=Key('agent_name').eq(agent_name)
    )
    return 'Items' in response and len(response['Items']) > 0

def upsert_agent(agent_name: str, agent_url: str, endpoint: str, description: str, metadata: dict) -> tuple:
    """
    Function to write to DynamoDB table
    """
    # Check if agent already exists
    exists = agent_exists(agent_name)

    # Current timestamp
    timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

    # Write to table
    table.put_item(
       Item={
            'agent_name': agent_name,
            'timestamp': timestamp,
            'agent_url': agent_url,
            'endpoint': endpoint,
            'description': description,
            'metadata': metadata
        }
    )

    # Return appropriate HTTP status code and message
    if exists:
        return f"Agent '{agent_name}' was overwritten."
    else:
        return f"Agent '{agent_name}' was added."

def get_all_agents():
    """
    Function to get all agents from DynamoDB table
    """
    # Scan the table
    response = table.scan()

    # Extract items from the response
    agents = response['Items']

    return agents
