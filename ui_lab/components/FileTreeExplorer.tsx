import { cn } from "@/lib/utils";
import * as React from "react";

/**
 * **File Tree / Explorer Component** — hierarchical file/folder navigation
 *
 * Supports:
 * - Nested folder structure
 * - Expand/collapse toggle
 * - File icons
 * - Click handlers
 * - Active/selected state
 *
 * Use: Code editors, file explorers, documentation sidebars
 */

export interface FileTreeNode {
  id: string;
  name: string;
  type: "file" | "folder";
  icon?: React.ReactNode;
  children?: FileTreeNode[];
}

export interface FileTreeProps extends React.HTMLAttributes<HTMLDivElement> {
  nodes: FileTreeNode[];
  onSelect?: (node: FileTreeNode) => void;
  selectedId?: string;
}

export const FileTree = React.forwardRef<HTMLDivElement, FileTreeProps>(
  (
    {
      nodes,
      onSelect,
      selectedId,
      className,
      ...props
    },
    ref,
  ) => {
    const [expandedIds, setExpandedIds] = React.useState<Set<string>>(new Set());

    const toggleExpand = (id: string) => {
      setExpandedIds((prev) => {
        const newSet = new Set(prev);
        newSet.has(id) ? newSet.delete(id) : newSet.add(id);
        return newSet;
      });
    };

    const renderNode = (node: FileTreeNode, depth: number = 0) => {
      const isExpanded = expandedIds.has(node.id);
      const hasChildren = node.children && node.children.length > 0;

      return (
        <div key={node.id}>
          <div
            className={cn(
              "flex items-center gap-2 px-2 py-1 rounded cursor-pointer hover:bg-muted transition-colors",
              selectedId === node.id && "bg-primary/10 text-primary",
            )}
            style={{ paddingLeft: `${depth * 20 + 8}px` }}
            onClick={() => {
              if (node.type === "folder") toggleExpand(node.id);
              onSelect?.(node);
            }}
          >
            {hasChildren && (
              <span className={`transition-transform ${isExpanded ? "rotate-90" : ""}`}>
                ▶
              </span>
            )}
            {!hasChildren && <span className="w-4" />}

            {node.icon && <span className="flex-shrink-0">{node.icon}</span>}
            <span className="text-sm flex-1">{node.name}</span>
          </div>

          {hasChildren && isExpanded && (
            <div>
              {node.children!.map((child) => renderNode(child, depth + 1))}
            </div>
          )}
        </div>
      );
    };

    return (
      <div
        ref={ref}
        className={cn("select-none", className)}
        {...props}
      >
        {nodes.map((node) => renderNode(node))}
      </div>
    );
  },
);

FileTree.displayName = "FileTree";
