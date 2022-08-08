<script setup>
// This starter template is using Vue 3 <script setup> SFCs
import { ref } from 'vue'
let start = ref(false);
</script>

<template>
	<a href="https://github.com/juruocjl/fake-generals" target="_blank" class="ribbons" v-if="!start">
		<img loading="lazy" width="149" height="149" src="forkme_right_darkblue_121621.png" class="attachment-full size-full" alt="Fork me on GitHub" data-recalc-dims="1">
	</a>
	<div class="index" v-if="!start">
		<div class="contain">
		<div id="name" class="name"></div>
		<div>当前rating为<span id="rating"></span></div><br>
		<button id="start">Start!</button><br>
		<input type="radio" name="gametype" value="ffa" id="ffa">FFA(rated)<br>
		<input type="radio" name="gametype" value="sb" id="sb">伞兵大战<br>
		<input type="radio" name="gametype" value="dark" id="dark">浓雾模式<br>
		<input type="radio" name="gametype" value="toxins" id="toxins">掉坑模式<br>
		<input type="radio" name="gametype" value="yinjian" id="yinjian">阴间模式<br>
		<input type="radio" name="gametype" value="team" id="team">团队模式<br>
		<div style="display: flex;">
			<span>
				<div id="team1" class="teamchoose">team1</div>
				<div id="team1name" class="teamname"></div>
			</span>
			<span>
				<div id="team2" class="teamchoose">team2</div>
				<div id="team2name" class="teamname"></div>
			</span>
			<span>
				<div id="cancel" class="teamchoose">cancel</div>
			</span>
		</div>
		</div>
	</div>
	<div class="gameend" style="display:none">
	</div>
	<div class="turn">turn <span id="turn">?</span></div>
	<div class="rank">
	<table><tbody id="rank">
		<tr>
			<th>rank</th>
			<th>name</th>
			<th>army</th>
			<th>land</th>
		</tr>
	</tbody></table>
	</div>
	<div class="toolcontain">
		<div class="outer" id="showsearch">
			<div class="search"></div>
		</div><br>
		<div class="outer" id="showinfo">
			<div class="infos"></div>
		</div><br>
		<div class="outer" id="showdrank">
			<div class="donationrk"></div>
		</div><br>
		<div class="outer" id="showrank">
			<div class="ranking"></div>
		</div>
	</div>
	<div class="notice">
		
	</div>
	<table cellspacing="0" cellpadding="0" border="0">
		 <tbody class="map"  style="display:none;">
		 </tbody>
	</table>
</template>

