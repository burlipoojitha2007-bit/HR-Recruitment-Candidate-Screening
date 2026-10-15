"""
Academic Module: B-Tree Candidate Indexing & Search Engine Demonstration
College Project: HR Recruitment & Candidate Screening System

Purpose:
Demonstrates multi-way balanced indexing tree data structure for candidates.
- Search Complexity: O(log_m N) comparisons
- Linear Unindexed Table Scan Complexity: O(N) comparisons
- Multi-way nodes with proactive splitting on overflow (order m).

DISCLAIMER FOR ACADEMIC EVALUATION:
This candidate B-Tree index simulator is authored in Python and JavaScript by our project
team as an educational demonstration of multi-way indexing trees and algorithmic time complexity.
SQLite internally utilizes its own native, highly-optimized C implementation of B-Trees for
tables and indices.
"""

from typing import List, Dict, Any, Optional

class BTreeNode:
    def __init__(self, is_leaf: bool = True):
        self.keys: List[int] = []
        self.candidates: List[Dict[str, Any]] = []
        self.children: List['BTreeNode'] = []
        self.is_leaf: bool = is_leaf
        self.node_id: str = f"node_{id(self) % 10000}"

    def to_dict(self) -> Dict[str, Any]:
        """Convert tree to a nested dictionary for visual rendering in the UI."""
        return {
            "node_id": self.node_id,
            "is_leaf": self.is_leaf,
            "keys": self.keys,
            "candidates": [
                {
                    "candidate_id": c.get("candidate_id"),
                    "name": c.get("name"),
                    "education": c.get("education"),
                    "experience": c.get("experience"),
                    "fit_score": c.get("fit_score", 0)
                }
                for c in self.candidates
            ],
            "children": [child.to_dict() for child in self.children]
        }

class CandidateBTree:
    def __init__(self, order: int = 3):
        # Order m: max children = m, max keys = m - 1
        self.order: int = max(3, order)
        self.root: BTreeNode = BTreeNode(is_leaf=True)

    def insert(self, key: int, candidate: Dict[str, Any]):
        """Insert a candidate keyed by candidate_id or composite score."""
        root = self.root
        if len(root.keys) >= self.order - 1:
            new_root = BTreeNode(is_leaf=False)
            new_root.children.append(self.root)
            self._split_child(new_root, 0, self.root)
            self.root = new_root
            self._insert_non_full(self.root, key, candidate)
        else:
            self._insert_non_full(root, key, candidate)

    def _split_child(self, parent: BTreeNode, index: int, child: BTreeNode):
        t = self.order // 2
        new_child = BTreeNode(is_leaf=child.is_leaf)

        # Keys and candidate data partition
        mid_key = child.keys[t]
        mid_candidate = child.candidates[t]

        new_child.keys = child.keys[t + 1:]
        new_child.candidates = child.candidates[t + 1:]
        child.keys = child.keys[:t]
        child.candidates = child.candidates[:t]

        if not child.is_leaf:
            new_child.children = child.children[t + 1:]
            child.children = child.children[:t + 1]

        parent.children.insert(index + 1, new_child)
        parent.keys.insert(index, mid_key)
        parent.candidates.insert(index, mid_candidate)

    def _insert_non_full(self, node: BTreeNode, key: int, candidate: Dict[str, Any]):
        i = len(node.keys) - 1

        if node.is_leaf:
            while i >= 0 and key < node.keys[i]:
                i -= 1
            # If key already exists, update record
            if i >= 0 and node.keys[i] == key:
                node.candidates[i] = candidate
                return
            node.keys.insert(i + 1, key)
            node.candidates.insert(i + 1, candidate)
        else:
            while i >= 0 and key < node.keys[i]:
                i -= 1
            i += 1

            if len(node.children[i].keys) >= self.order - 1:
                self._split_child(node, i, node.children[i])
                if key > node.keys[i]:
                    i += 1

            self._insert_non_full(node.children[i], key, candidate)

    def search_with_trace(self, key: int, total_records: int) -> Dict[str, Any]:
        """
        Searches for a key while recording every traversal step.
        Provides educational comparison between B-Tree O(log N) and Linear Scan O(N).
        """
        trace = []
        comparisons = 0
        current = self.root
        found_candidate = None

        while current:
            node_info = {
                "node_id": current.node_id,
                "node_keys": list(current.keys),
                "is_leaf": current.is_leaf,
                "action": ""
            }

            i = 0
            while i < len(current.keys) and key > current.keys[i]:
                comparisons += 1
                i += 1

            if i < len(current.keys):
                comparisons += 1
                if current.keys[i] == key:
                    found_candidate = current.candidates[i]
                    node_info["action"] = f"Key {key} found at index {i} in node {current.node_id}!"
                    trace.append(node_info)
                    break
                else:
                    node_info["action"] = f"Key {key} < {current.keys[i]}. Descending to child pointer {i}."
            else:
                node_info["action"] = f"Key {key} > all keys in node. Descending to rightmost child pointer {i}."

            trace.append(node_info)

            if current.is_leaf:
                break
            current = current.children[i]

        linear_comparisons = key if key <= total_records else total_records

        return {
            "key_searched": key,
            "found": found_candidate is not None,
            "candidate": found_candidate,
            "btree_comparisons": comparisons,
            "btree_complexity": "O(log_m N)",
            "linear_scan_comparisons": linear_comparisons,
            "linear_scan_complexity": "O(N)",
            "speedup_percentage": round(((linear_comparisons - comparisons) / max(linear_comparisons, 1)) * 100, 1),
            "traversal_trace": trace,
            "disclaimer": "Educational indexing demonstration authored by project team. SQLite uses separate native C B-Tree."
        }

    def get_tree_structure(self) -> Dict[str, Any]:
        return {
            "order": self.order,
            "root": self.root.to_dict()
        }
