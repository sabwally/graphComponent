<template>
    <h1>Graph Component</h1>
    <GraphComponent filePath="./text.txt" :xmlData="xmlStrClear" />
    <!--<h2>Another one</h2>-->
    <!--<GraphComponent filePath="./text.txt" :xmlData="xmlStr3" />-->
    <!--<div class="canvas-container">
        <div class="canvas-wrapper">
            <h1>Graph Component</h1>
            <GraphComponent filePath="./text.txt" :xmlData="xmlString2" />
        </div>
        <div class="canvas-wrapper">
            <h2>Another one</h2>
            <GraphComponent filePath="./text.txt" :xmlData="xmlString" />
        </div>
    </div>-->
    <!--<GraphComponent filePath="./text.txt" />-->
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import GraphComponent from './components/GraphComponent.vue';

export default defineComponent({
  name: 'App',
  components: {
    GraphComponent
    },
    setup() {
        const xmlString = `
        <graph>
            <canvas height="500" width="600"/>

            <node id="cloud1111" type="cloud" label="Sky is blue">
                <geometry x_center="-75" y_center="100"/>
                <background color="white"/>
                <labelSettings font="bold italic 14px Arial" color="black" />
            </node>

            <node id="star" type="star" label="">
                <geometry x_center="100" y_center="85"/>
                <background color=""/>
                <labelSettings font="14px Arial" color="black"/>
            </node>

            <node id="star2" type="star" label="">
                <geometry x_center="250" y_center="85"/>
                <background color="gold"/>
                <labelSettings font="10px Arial" color="black"/>
            </node>

            <customDescriptions>
                <customDescription type="cloud">
                    <points>
                        <point x="170" y="80"/>
                        <point x="230" y="150"/>
                        <point x="340" y="150"/>
                        <point x="390" y="100"/>
                        <point x="340" y="50"/>
                        <point x="250" y="50"/>
                        <point x="170" y="80"/>
                    </points>
                    <curve>
                        <curvePoint isCurved="true" cp1x="130" cp1y="100" cp2x="130" cp2y="150"/>
                        <curvePoint isCurved="true" cp1x="250" cp1y="180" cp2x="320" cp2y="180"/>
                        <curvePoint isCurved="true" cp1x="420" cp1y="150" cp2x="420" cp2y="120"/>
                        <curvePoint isCurved="true" cp1x="430" cp1y="40" cp2x="310" cp2y="10"/>
                        <curvePoint isCurved="true" cp1x="320" cp1y="5" cp2x="250" cp2y="20"/>
                        <curvePoint isCurved="true" cp1x="200" cp1y="5" cp2x="150" cp2y="20"/>
                    </curve>
                </customDescription>
                <customDescription type="star">
                    <points>
                        <point x="0" y="-30"/>
                        <point x="-5.510910596163089e-15" y="-30"/>
                        <point x="8.816778784387093" y="-12.135254915624213"/>
                        <point x="28.531695488854606" y="-9.27050983124843"/>
                        <point x="14.265847744427305" y="4.635254915624207"/>
                        <point x="17.6335575687742" y="24.270509831248418"/>
                        <point x="4.592425496802574e-15" y="15"/>
                        <point x="-17.633557568774187" y="24.27050983124843"/>
                        <point x="-14.265847744427301" y="4.635254915624217"/>
                        <point x="-28.53169548885461" y="-9.270509831248411"/>
                        <point x="-8.816778784387102" y="-12.135254915624209"/>
                        <point x="0" y="-30"/>
                    </points>
                    <curve>
                        <curvePoint isCurved="false" cp1x="0" cp1y="0" cp2x="0" cp2y="0"/>
                        <curvePoint isCurved="false" cp1x="0" cp1y="0" cp2x="0" cp2y="0"/>
                        <curvePoint isCurved="false" cp1x="0" cp1y="0" cp2x="0" cp2y="0"/>
                        <curvePoint isCurved="false" cp1x="0" cp1y="0" cp2x="0" cp2y="0"/>
                        <curvePoint isCurved="false" cp1x="0" cp1y="0" cp2x="0" cp2y="0"/>
                        <curvePoint isCurved="false" cp1x="0" cp1y="0" cp2x="0" cp2y="0"/>
                        <curvePoint isCurved="false" cp1x="0" cp1y="0" cp2x="0" cp2y="0"/>
                        <curvePoint isCurved="false" cp1x="0" cp1y="0" cp2x="0" cp2y="0"/>
                        <curvePoint isCurved="false" cp1x="0" cp1y="0" cp2x="0" cp2y="0"/>
                        <curvePoint isCurved="false" cp1x="0" cp1y="0" cp2x="0" cp2y="0"/>
                        <curvePoint isCurved="false" cp1x="0" cp1y="0" cp2x="0" cp2y="0"/>
                    </curve>
                </customDescription>
            </customDescriptions>

        </graph>
        `;

        const xmlString2 = `
        <graph>
            <canvas height="280" width="300"/>

            <edge id="line3" type="line" label="Line" rotation="0" endArrow="none" startArrow="triangle">
                <geometry startX="150" startY="50" endX="250" endY="50"/>
                <background color=""/>
                <edgeStyle lineWidth="1" />
                <labelSettings font="14px Arial" color="black"/>
            </edge>

            <node id="circle1" type="circle" label="" rotation="0">
                <geometry x="150" y="100" radius="30"/>
                <background color="red"/>
                <labelSettings font="14px Arial" color="white"/>
            </node>

            <node id="rect1" type="rectangle" label="" rotation="0" isEdgeDash = "true">
                <geometry x="200" y="150" width="80" height="40"/>
                <background color="blue"/>
                <labelSettings font="Bold 17px Arial" color="white"/>
            </node>

            <node id="tri1" type="triangle" label="" rotation="0">
                <geometry x1="100" y1="200" x2="130" y2="250" x3="70" y3="250"/>
                <background color="#ffcc00"/>
                <labelSettings font="18px Arial" color="black"/>
            </node>

            <node id="oval" type="ellipse" label="" rotation="20">
                <geometry x="100" y="200" radius_x="30" radius_y="60" />
                <background color="#ffcc00"/>
                <labelSettings font="18px Arial" color="black"/>
            </node>

            <node id="circle2" type="circle" label="" rotation="0">
                <geometry x="50" y="50" radius="20"/>
                <background color="green"/>
                <labelSettings font="14px Arial" color="white"/>
            </node>

            <node id="rect2" type="rectangle" label="" rotation="0">
                <geometry x="30" y="100" width="40" height="60"/>
                <background color="purple"/>
                <labelSettings font="Bold 17px Arial" color="white"/>
            </node>

            <node id="poly1" type="regular polygon" label="" rotation="0">
                <geometry x="150" y="100" radius="30" number_of_edges="5"/>
                <background color=""/>
                <labelSettings font="14px Arial" color="white"/>
            </node>

        </graph>
        `;



        const xmlStr3 = `
        <graph>
            <canvas height="500" width="700"/>

            <edge id="line1" type="line" label="" rotation="0" endArrow="none" startArrow="none">
                <geometry startX="180" startY="120" endX="370" endY="200"/>
                <background color="black"/>
                <edgeStyle lineWidth="" />
                <labelSettings font="14px Arial" color="black"/>
            </edge>

            <edge id="line2" type="line" label="" rotation="0" endArrow="none" startArrow="none">
                <geometry startX="430" startY="200" endX="570" endY="150"/>
                <background color="black"/>
                <edgeStyle lineWidth="" />
                <labelSettings font="14px Arial" color="black"/>
            </edge>

            <edge id="line3" type="line" label="" rotation="0" endArrow="none" startArrow="none">
                <geometry startX="600" startY="180" endX="515" endY="273"/>
                <background color="black"/>
                <edgeStyle lineWidth="" />
                <labelSettings font="14px Arial" color="black"/>
            </edge>

            <edge id="line4" type="line" label="" rotation="0" endArrow="none" startArrow="none">
                <geometry startX="470" startY="300" endX="330" endY="400"/>
                <background color="black"/>
                <edgeStyle lineWidth="" />
                <labelSettings font="14px Arial" color="black"/>
            </edge>

            <edge id="line5" type="line" label="" rotation="0" endArrow="none" startArrow="none">
                <geometry startX="150" startY="150" endX="270" endY="400"/>
                <background color="black"/>
                <edgeStyle lineWidth="" />
                <labelSettings font="14px Arial" color="black"/>
            </edge>

            <node id="circle1" type="circle" label="" rotation="0">
                <geometry x="150" y="120" radius="30"/>
                <background color="yellow"/>
                <labelSettings font="14px Arial" color="black"/>
            </node>

            <node id="circle2" type="circle" label="" rotation="0">
                <geometry x="400" y="200" radius="30"/>
                <background color="cyan"/>
                <labelSettings font="14px Arial" color="black"/>
            </node>

            <node id="circle3" type="circle" label="" rotation="0">
                <geometry x="600" y="150" radius="30"/>
                <background color="magenta"/>
                <labelSettings font="14px Arial" color="black"/>
            </node>

            <node id="circle4" type="circle" label="" rotation="0">
                <geometry x="500" y="300" radius="30"/>
                <background color="lime"/>
                <labelSettings font="14px Arial" color="black"/>
            </node>

            <node id="circle5" type="circle" label="" rotation="0">
                <geometry x="300" y="400" radius="30"/>
                <background color="orange"/>
                <labelSettings font="14px Arial" color="black"/>
            </node>
        </graph>
        `;

        const xmlStrClear = `
        <graph>
            <canvas height="800" width="800"/>

        </graph>
        `;

        return {
            xmlString, xmlString2, xmlStr3, xmlStrClear
        };
    }
});
</script>

<style>
    #app {
        font-family: Avenir, Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
        margin-top: 60px;
    }
    /*.canvas-container {
        display: flex;*/ /* Используем flexbox для горизонтального расположения */
        /*justify-content: space-around;*/ /* Распределяем пространство между канвасами */
        /*align-items: flex-start;*/ /* Выравниваем элементы по верхнему краю */
    /*}

    .canvas-wrapper {
        display: flex;
        flex-direction: column;*/ /* Вертикальное расположение заголовка и канваса */
        /*align-items: center;*/ /* Центрируем элементы внутри контейнера */
    /*}*/
    html {
        background-color: goldenrod;
    }

</style>
