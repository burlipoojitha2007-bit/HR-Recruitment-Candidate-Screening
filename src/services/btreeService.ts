import { Candidate, BTreeNodeData, BTreeSearchResult } from '../types';

/**
 * ACADEMIC MODULE: ADDSA (Advanced Data Structures and Algorithms)
 * B-Tree Candidate Indexing & Efficient Search Engine
 * 
 * Demonstrates:
 * - Multi-way search tree where each node can hold multiple keys and children.
 * - Balanced tree guarantee: all leaves at the same depth.
 * - Time Complexity:
 *     Search: O(log_m N) comparisons / disk I/O operations
 *     Insertion: O(log_m N)
 *   Compared to Unindexed Sequential Table Scan: O(N)
 * - Node Splitting on overflow (when keys >= order m).
 */

export class BTreeNode {
  public keys: number[];
  public candidates: Candidate[];
  public children: BTreeNode[];
  public isLeaf: boolean;
  public id: string;

  constructor(isLeaf = true) {
    this.keys = [];
    this.candidates = [];
    this.children = [];
    this.isLeaf = isLeaf;
    this.id = `node-${Math.random().toString(36).substring(2, 9)}`;
  }
}

export class BTreeIndex {
  public root: BTreeNode;
  public order: number; // Order m (maximum children per node = m, maximum keys = m - 1)

  constructor(order = 3) {
    this.order = Math.max(3, order);
    this.root = new BTreeNode(true);
  }

  /**
   * Resets and rebuilds the B-Tree with candidates
   */
  public buildIndex(candidates: Candidate[]): void {
    this.root = new BTreeNode(true);
    // Sort or insert in realistic sequence
    const sorted = [...candidates].sort((a, b) => a.id - b.id);
    sorted.forEach(c => this.insert(c.id, c));
  }

  /**
   * Insert a Candidate into the B-Tree
   */
  public insert(key: number, candidate: Candidate): void {
    const root = this.root;
    // If root is full, split it
    if (root.keys.length >= this.order - 1) {
      const newRoot = new BTreeNode(false);
      newRoot.children.push(this.root);
      this.splitChild(newRoot, 0, this.root);
      this.root = newRoot;
      this.insertNonFull(this.root, key, candidate);
    } else {
      this.insertNonFull(root, key, candidate);
    }
  }

  private insertNonFull(node: BTreeNode, key: number, candidate: Candidate): void {
    let i = node.keys.length - 1;

    if (node.isLeaf) {
      // Insert in sorted position
      while (i >= 0 && key < node.keys[i]) {
        i--;
      }
      // Check if key already exists (update record)
      if (i >= 0 && node.keys[i] === key) {
        node.candidates[i] = candidate;
        return;
      }
      node.keys.splice(i + 1, 0, key);
      node.candidates.splice(i + 1, 0, candidate);
    } else {
      // Find which child will receive the new key
      while (i >= 0 && key < node.keys[i]) {
        i--;
      }
      i++;

      // Check if the chosen child is full
      if (node.children[i].keys.length >= this.order - 1) {
        this.splitChild(node, i, node.children[i]);
        if (key > node.keys[i]) {
          i++;
        }
      }
      this.insertNonFull(node.children[i], key, candidate);
    }
  }

  /**
   * Split a full child node into two nodes and promote median key
   */
  private splitChild(parent: BTreeNode, index: number, fullChild: BTreeNode): void {
    const midIndex = Math.floor((this.order - 1) / 2);
    const medianKey = fullChild.keys[midIndex];
    const medianCandidate = fullChild.candidates[midIndex];

    const sibling = new BTreeNode(fullChild.isLeaf);

    // Sibling gets keys after the median
    sibling.keys = fullChild.keys.slice(midIndex + 1);
    sibling.candidates = fullChild.candidates.slice(midIndex + 1);

    // If not a leaf, sibling gets children after midIndex
    if (!fullChild.isLeaf) {
      sibling.children = fullChild.children.slice(midIndex + 1);
      fullChild.children = fullChild.children.slice(0, midIndex + 1);
    }

    // Truncate fullChild to before midIndex
    fullChild.keys = fullChild.keys.slice(0, midIndex);
    fullChild.candidates = fullChild.candidates.slice(0, midIndex);

    // Insert sibling into parent's children
    parent.children.splice(index + 1, 0, sibling);

    // Promote median key to parent
    parent.keys.splice(index, 0, medianKey);
    parent.candidates.splice(index, 0, medianCandidate);
  }

  /**
   * Interactive Search demonstrating traversal steps and ADDSA Big-O comparison
   */
  public search(key: number): BTreeSearchResult {
    const steps: BTreeSearchResult['steps'] = [];
    let current: BTreeNode | null = this.root;
    let comparisonsCount = 0;
    let found = false;
    let foundCandidate: Candidate | undefined;

    while (current) {
      let i = 0;
      let foundInCurrent = false;

      while (i < current.keys.length) {
        comparisonsCount++;
        const currKey = current.keys[i];

        if (key === currKey) {
          steps.push({
            nodeId: current.id,
            keys: [...current.keys],
            comparison: `Target ${key} == Key ${currKey} (MATCH FOUND!)`,
            action: `Candidate Record retrieved at memory pointer #${currKey}`
          });
          found = true;
          foundCandidate = current.candidates[i];
          foundInCurrent = true;
          break;
        } else if (key < currKey) {
          steps.push({
            nodeId: current.id,
            keys: [...current.keys],
            comparison: `Target ${key} < Key ${currKey}`,
            action: `Branching to left child pointer at index [${i}]`
          });
          break;
        } else {
          // key > currKey
          if (i === current.keys.length - 1) {
            steps.push({
              nodeId: current.id,
              keys: [...current.keys],
              comparison: `Target ${key} > Key ${currKey} (Largest key in node)`,
              action: `Branching to rightmost child pointer at index [${i + 1}]`
            });
          }
          i++;
        }
      }

      if (foundInCurrent) {
        break;
      }

      if (current.isLeaf) {
        steps.push({
          nodeId: current.id,
          keys: [...current.keys],
          comparison: `Target ${key} not found in leaf node`,
          action: `Search terminated: Candidate ID ${key} does not exist in index`
        });
        current = null;
      } else {
        current = current.children[i] || null;
      }
    }

    return {
      found,
      searchedKey: key,
      steps,
      comparisonsCount,
      timeComplexity: `O(log_${this.order} N) = ${comparisonsCount} disk/node operations vs Sequential Scan: O(N) = ${found ? key : 'all'} candidate inspections`,
      candidate: foundCandidate
    };
  }

  /**
   * Exports nested tree hierarchy for interactive UI visualization
   */
  public toVisualData(node: BTreeNode = this.root): BTreeNodeData {
    return {
      id: node.id,
      keys: [...node.keys],
      values: [...node.candidates],
      isLeaf: node.isLeaf,
      children: node.children.map(ch => this.toVisualData(ch))
    };
  }

  /**
   * Calculates tree depth
   */
  public getDepth(node: BTreeNode = this.root): number {
    if (node.isLeaf) return 1;
    if (node.children.length === 0) return 1;
    return 1 + this.getDepth(node.children[0]);
  }
}
