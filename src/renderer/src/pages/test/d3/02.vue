<template>
    <div class="outer-container">
        <div class="tree-content">
            <svg ref="svg" width="800" height="600" @mousedown="mousedown">
                <g ref="treeGroup" transform="translate(100,0)"></g>
            </svg>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import * as d3 from "d3";

interface TreeNode {
    name: string;
    children?: TreeNode[];
    _children?: TreeNode[];
}

export default defineComponent({
    name: "TreeGraph",
    setup() {
        const treeGroup = ref<SVGGElement | null>(null);
        const isMoving = ref(false);
        const startCoords = { x: 0, y: 0 };
        const currentTransform = { x: 100, y: 0 };

        const data: TreeNode = {
            name: "Root",
            children: [
                {
                    name: "Child 1",
                    children: [
                        { name: "Grandchild 1.1" },
                        { name: "Grandchild 1.2" },
                    ],
                },
                {
                    name: "Child 2",
                    children: [
                        { name: "Grandchild 2.1" },
                        { name: "Grandchild 2.2" },
                    ],
                },
            ],
        };

        function createTree(container: SVGGElement, data: TreeNode) {
            const width = 800;
            const height = 600;

            const root = d3.hierarchy<TreeNode>(data);
            root.x0 = height / 2;
            root.y0 = 0;

            update(root);

            function update(source: d3.HierarchyPointNode<TreeNode>) {
                const treeLayout = d3.tree<TreeNode>().size([height, width - 200]);
                const treeData = treeLayout(root);
                const nodes = treeData.descendants();
                const links = treeData.descendants().slice(1);

                nodes.forEach((d) => {
                    d.y = d.depth * 180; 
                });

                const node = d3.select(container).selectAll<SVGGElement, TreeNode>("g.node")
                    .data(nodes, (d) => d.id || (d.id = d.data.name));

                const nodeEnter = node.enter()
                    .append("g")
                    .attr("class", "node")
                    .attr("transform", () => `translate(${source.y0},${source.x0})`)
                    .on("click", (event, d) => {
                        onClick(d);
                    });

                nodeEnter.append("circle")
                    .attr("class", "node")
                    .attr("r", 10)
                    .style("fill", (d) => d._children ? "lightsteelblue" : "#fff");

                nodeEnter.append("text")
                    .attr("dy", ".35em")
                    .attr("x", (d) => d.children || d._children ? -13 : 13)
                    .attr("text-anchor", (d) => d.children || d._children ? "end" : "start")
                    .text((d) => d.data.name);

                const nodeUpdate = nodeEnter.merge(node);
                nodeUpdate.transition()
                    .duration(200)
                    .attr("transform", (d) => `translate(${d.y},${d.x})`);

                node.exit().transition()
                    .duration(200)
                    .attr("transform", () => `translate(${source.y},${source.x})`)
                    .remove();

                const link = d3.select(container).selectAll<SVGPathElement, d3.HierarchyPointNode<TreeNode>>("path.link")
                    .data(links, (d) => d.id);

                const linkEnter = link.enter()
                    .insert("path", "g")
                    .attr("class", "link")
                    .attr("d", () => {
                        const o = { x: source.x0, y: source.y0 };
                        return diagonal(o, o);
                    })
                    .attr('fill', 'none')
                    .style("stroke", "pink");

                link.merge(linkEnter).transition()
                    .duration(200)
                    .attr("d", (d) => diagonal(d, d.parent));

                link.exit().transition()
                    .duration(200)
                    .attr("d", () => {
                        const o = { x: source.x, y: source.y };
                        return diagonal(o, o);
                    })
                    .remove();

                nodes.forEach((d) => {
                    d.x0 = d.x;
                    d.y0 = d.y;
                });
            }

            function onClick(d: d3.HierarchyPointNode<TreeNode>) {
                if (d.children) {
                    d._children = d.children;
                    d.children = null;
                } else {
                    d.children = d._children;
                    d._children = null;
                }
                update(d);
            }

            function diagonal(s, d) {
                const path = d3.path();
                const midX = (s.y + d.y) / 2;
                path.moveTo(s.y, s.x);
                path.bezierCurveTo(midX, s.x, midX, d.x, d.y, d.x);
                return path.toString();
            }
        }

        const mousedown = (e: MouseEvent) => {
            isMoving.value = true;
            startCoords.x = e.clientX - currentTransform.x;
            startCoords.y = e.clientY - currentTransform.y;

            document.addEventListener('mousemove', mousemove);
            document.addEventListener('mouseup', mouseup);
        };

        const mousemove = (e: MouseEvent) => {
            if (!isMoving.value) return;

            const dx = e.clientX - startCoords.x;
            const dy = e.clientY - startCoords.y;

            // 限制拖动：如果鼠标位置超出阈值，则不移动
            if (Math.abs(dx) < 5 && Math.abs(dy) < 5) return;

            currentTransform.x = e.clientX - startCoords.x;
            currentTransform.y = e.clientY - startCoords.y;

            if (treeGroup.value) {
                treeGroup.value.setAttribute("transform", `translate(${currentTransform.x},${currentTransform.y})`);
            }
        };

        const mouseup = () => {
            isMoving.value = false;
            document.removeEventListener('mousemove', mousemove);
            document.removeEventListener('mouseup', mouseup);
        };

        onMounted(() => {
            if (treeGroup.value) {
                createTree(treeGroup.value, data);
            }
        });

        return {
            treeGroup,
            mousedown,
        };
    },
});
</script>

<style scoped>
.outer-container {
    position: relative;
    width: 100vw;
    height: 100vh;
}

.tree-content {
    border: #fff solid 1px;
    position: relative;
    width: 100%;
    height: 100%;
}

.node {
    cursor: pointer;
}

.node circle {
    fill: #fff;
    stroke: steelblue;
    stroke-width: 3px;
}

.node text {
    font: 12px sans-serif;
}

.link {
    fill: none;
    stroke: pink;
    stroke-width: 2px;
}
</style>
