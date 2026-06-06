from langgraph.graph import StateGraph, END
from typing import TypedDict, Optional
from agents.orchestrator import orchestrator

class AgentState(TypedDict):
    user_id: str
    message: str
    user_type: str
    language: str
    contact_phone: Optional[str]
    result: Optional[dict]

def run_agents(state: AgentState) -> AgentState:
    result = orchestrator(
        user_id=state["user_id"],
        message=state["message"],
        user_type=state["user_type"],
        language=state["language"],
        contact_phone=state.get("contact_phone")
    )
    return {**state, "result": result}

def build_graph():
    graph = StateGraph(AgentState)
    graph.add_node("agents", run_agents)
    graph.set_entry_point("agents")
    graph.add_edge("agents", END)
    return graph.compile()

mindbridge_graph = build_graph()