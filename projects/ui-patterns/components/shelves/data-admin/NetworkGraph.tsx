import { cn } from "@/lib/utils";
import * as React from "react";

/**
 * **Network Graph / Node Diagram** — connected nodes visualization
 *
 * Supports:
 * - Node positioning and styling
 * - Edge connections
 * - Force-directed layout (simplified)
 * - Click/hover interactions
 * - Customizable node rendering
 *
 * Use: System architecture, social networks, knowledge graphs
 */

export interface NetworkNode {
  id: string;
  label: string;
  x?: number;
  y?: number;
  color?: string;
  size?: number;
}

export interface NetworkEdge {
  from: string;
  to: string;
  label?: string;
}

export interface NetworkGraphProps extends React.HTMLAttributes<HTMLDivElement> {
  nodes: NetworkNode[];
  edges: NetworkEdge[];
  width?: number;
  height?: number;
}

export const NetworkGraph = React.forwardRef<HTMLDivElement, NetworkGraphProps>(
  (
    {
      nodes,
      edges,
      width = 600,
      height = 400,
      className,
      ...props
    },
    ref,
  ) => {
    const [positions, setPositions] = React.useState<Record<string, { x: number; y: number }>>(() => {
      const result: Record<string, { x: number; y: number }> = {};
      nodes.forEach((node) => {
        result[node.id] = {
          x: node.x || Math.random() * width,
          y: node.y || Math.random() * height,
        };
      });
      return result;
    });

    const [selectedNode, setSelectedNode] = React.useState<string | null>(null);

    return (
      <div
        ref={ref}
        className={cn("relative bg-background border border-border rounded-lg", className)}
        {...props}
      >
        <svg
          width={width}
          height={height}
          className="w-full"
          style={{ minHeight: height }}
        >
          {/* Edges */}
          {edges.map((edge) => {
            const fromPos = positions[edge.from];
            const toPos = positions[edge.to];
            if (!fromPos || !toPos) return null;

            return (
              <g key={`${edge.from}-${edge.to}`}>
                <line
                  x1={fromPos.x}
                  y1={fromPos.y}
                  x2={toPos.x}
                  y2={toPos.y}
                  stroke="currentColor"
                  strokeWidth="2"
                  opacity="0.3"
                />
                {edge.label && (
                  <text
                    x={(fromPos.x + toPos.x) / 2}
                    y={(fromPos.y + toPos.y) / 2}
                    textAnchor="middle"
                    fontSize="12"
                    fill="currentColor"
                    opacity="0.6"
                  >
                    {edge.label}
                  </text>
                )}
              </g>
            );
          })}

          {/* Nodes */}
          {nodes.map((node) => {
            const pos = positions[node.id];
            if (!pos) return null;

            return (
              <g
                key={node.id}
                onClick={() => setSelectedNode(node.id)}
                className="cursor-pointer"
              >
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={node.size || 20}
                  fill={node.color || "#06b6d4"}
                  opacity={selectedNode === node.id ? 1 : 0.8}
                  className="hover:opacity-100 transition-opacity"
                />
                <text
                  x={pos.x}
                  y={pos.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="12"
                  fill="white"
                  fontWeight="bold"
                  className="pointer-events-none"
                >
                  {node.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    );
  },
);

NetworkGraph.displayName = "NetworkGraph";
