<!-- eslint-disable prettier/prettier -->
<template>
    <div>
        <h1>02</h1>
        <div class="wrap">
            <svg ref="svg" width="1000" height="700">

            </svg>
        </div>
    </div>
</template>

<script setup lang="ts">
import * as d3 from 'd3'
import { onMounted, Ref, ref } from 'vue'

type CItem = {
    name: string
    value?: number
    children?: CItem[]
}
// 基本树结构数据
const data: Ref<CItem | unknown> = ref()
data.value = {
    name: '中国',
    get shlf() {
        return this
    },
    children: [
        {
            name: '浙江',
            get shlf() {
                return this.children
            },
            children: [
                { name: '杭州', value: 100 },
                { name: '宁波', value: 100 },
                { name: '温州', value: 100 },
                { name: '绍兴', value: 100 }
            ]
        },
        // {
        //     name: '广西',
        //     children: [
        //         {
        //             name: '桂林',
        //             children: [
        //                 { name: '秀峰区', value: 100 },
        //                 { name: '叠彩区', value: 100 },
        //                 { name: '象山区', value: 100 },
        //                 { name: '七星区', value: 100 }
        //             ]
        //         },
        //         { name: '南宁', value: 100 },
        //         { name: '柳州', value: 100 },
        //         { name: '防城港', value: 100 }
        //     ]
        // },
        // {
        //     name: '黑龙江',
        //     children: [
        //         { name: '哈尔滨', value: 100 },
        //         { name: '齐齐哈尔', value: 100 },
        //         { name: '牡丹江', value: 100 },
        //         { name: '大庆', value: 100 }
        //     ]
        // },
        // {
        //     name: '新疆',
        //     children: [{ name: '乌鲁木齐' }, { name: '克拉玛依' }, { name: '吐鲁番' }, { name: '哈密' }]
        // }
    ]
}
// 创建一个层级布局
const hierarchyData = d3.hierarchy(data.value)
hierarchyData.sum(function (d) {
    return d.value || 0
})
// 节点点击事件
function clickNode(ev, d) {
    // console.log('[ clickNode ] >', d, i,)
    // if (!i.data?.children) {
    //     i.data.children = []
    // }
    // i.data.children.push({ name: '杭州', value: 100 })
    // hierarchyData = d3.hierarchy(data.value)
    // // 重新绘制
    // init()
    // // console.log('[ shlf ] >', i.shlf, i.data, data.value)
    // console.log('[ _children ] >', d._children)
    if (d?.depth !== 0) {

        if (d?.children) {
            d._children = d.children
            d.children = undefined
            init()
        } else if (d?._children) {
            console.log('[  d.children ] >', d.children)
            for (const v of d._children) {
                v.originX = v.parent.x // 保存父节点原本位置
                v.originY = v.parent.y
            }
            d.children = d._children
        }

    } else {
        d.children = d._children
        init()
    }
}
// 初始化函数
function init() {
    // 每颗子树间距
    const margin = ref(60)

    // 当前svg
    const svg = d3.select('svg')
    // console.log('[ svg.attr ] >', svg.attr, svg.getAttribute)
    // 宽高
    const width: number = svg.attr('width')
    const height: number = svg.attr('height')

    // 创建分组
    const g = svg
        .append('g')




    /*
              返回的节点和每一个后代会被附加如下属性:
              node.data - 关联的数据，由 constructor 指定.
              node.depth - 当前节点的深度, 根节点为 0.
              node.height - 当前节点的高度, 叶节点为 0.
              node.parent - 当前节点的父节点, 根节点为 null.
              node.children - 当前节点的孩子节点(如果有的话); 叶节点为 undefined.
              node.value - 当前节点以及 descendants(后代节点) 的总计值; 可以通过 node.sum 和 node.count 计算.
      */
    //   console.log(hierarchyData)

    // 创建一个树状图
    const tree = d3
        .tree() // 创建树
        .size([width - 400, height - 200]) // 树大小
        .separation(function (a, b) {
            // 一种更适合于径向布局的变体，可以按比例缩小半径差距:
            return (a.parent == b.parent ? 1 : 2) / a.depth
        })

    // 初始化树状图数据
    const treeData = tree(hierarchyData)
    //   这里的数据treeData与hierarchyData 相同
    console.log('[ treeData ] >', treeData)

    // 获取边和节点
    const nodes = treeData.descendants()
    const links = treeData.links()
    const $nodes = g.selectAll('.node')

    // 分组中添加动画,增加每个节点绑定Key 防止节点渲染时被复用
    g.attr('transform', 'translate(' + margin.value + ',' + margin.value + ')')

    $nodes.data(nodes, d => d.data.name + Date.now())
        .filter(a => a.originX !== undefined && a.originY !== undefined)
        .attr('transform', d => {
            let x, y

            if (d.originX) {
                x = d.originX
                delete d.originX
            } else {
                x = d.x
            }
            if (d.originY) {
                y = d.originY
                delete d.originY
            } else {
                y = d.y
            }

            return `translate(${x}, ${y})`
        })


    //创建贝塞尔曲线生成器
    const link = d3.linkHorizontal()
        .x(function (d) { return d.y; })//生成的曲线在曲线的终点和起点处的切线是水平方向的
        .y(function (d) { return d.x; })

    //绘制边
    g.append('g')
        .selectAll('path')
        .data(links)
        .enter()
        .append('path')
        .attr('d', function (d) {
            const start = { x: d.source.x, y: d.source.y }
            const end = { x: d.target.x, y: d.target.y }
            return link({ source: start, target: end })
        })
        .attr('stroke', '#1b1b1f')
        .attr('stroke-width', 1)
        .attr('fill', 'none')

    //创建节点与文字分组
    const gs = g.append('g')
        .selectAll('.g')
        .data(nodes)
        .enter()
        .append('g')
        .attr('transform', function (d) {
            return 'translate(' + d.y + ',' + d.x + ')'
        })


    //绘制节点
    gs.append('circle')
        .attr('r', 10) // 节点大小
        .attr('fill', '#1b6ef3') // 节点颜色
        .attr('stroke-width', 2) // 节点边框宽度
        .attr('stroke', '#0842a0') // 节点边框色
    // 获取子节点绑定事件
    gs.selectAll('circle')
        .on('click', clickNode)

    console.log('[ gs ] >',)
    //绘制文字
    gs.append('text')
        .attr('x', function (d) {
            // 调整文字节点距离边框的左间距
            return d.children ? -60 : 20//有子元素的话  当前节点的文字前移40
        })
        // 文件上下 xy偏移距离
        .attr('y', -5)
        .attr('dy', 10)
        // 文字
        .text(function (d) {
            return d.data.name
        })

}



onMounted(() => {
    init()
})
</script>

<style scoped>
.wrap {
    width: 100%;
    height: 100%;
    background-color: #ccc;
    border-radius: 2%;
}
</style>
