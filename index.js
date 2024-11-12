/**
 * ロード
 */
$(function(){
	'use strict';
	
	$('#game').hide();
	$('#win').hide();
	$('#lose').hide();
	$('#index').show();
	
	
	var clickevent = 'click';
	
	$('#easy').on(clickevent, function(){
		event.easy();
	});
	
	$('#normal').on(clickevent, function(){
		event.normal();
	});
	
	$('#hard').on(clickevent, function(){
		event.hard();
	});
	
	$('#veryhard').on(clickevent, function(){
		event.veryhard();
	});
	
	$('#next').on(clickevent, function(){
		event.next();
	});
	
	$('.init').on(clickevent, function(){
		event.init();
	});
});

/**
 * 画面イベント
 */
var event = new function(){
	'use strict';
	
	// 定数
	var 問題数 = 30;
	var 回答中 = 1;
	var 答え表示中 = 2;
	
	// 変数
	var 一問時間 = 0;
	var 何問目 = 0;
	var 一歩距離 = 0;
	
	var かけ算_第一項範囲;
	var かけ算_第二項範囲;
	var 余り;
	
	var カービ移動回数 = 0;
	var デデデ移動回数 = 0;
	
	var 開始時間;
	
	/**
	 * 音楽開始
	 */
	this.startMusic = function(){
		var audio = $('#audio').get(0);
		audio.play();
	};

	/**
	 * 音楽終了
	 */
	this.stopMusic = function(){
		var audio = $('#audio').get(0);
		audio.pause();
		audio.currentTime = 0;
	};
	
	
	/**
	 * かんたん
	 */
	this.easy = function(){
		event.startMusic();
		一問時間 = 5 * 1000;
		
		かけ算_第一項範囲 = [1, 9];
		かけ算_第二項範囲 = [1, 6];
		余り = false;
		
		event.countDown();
	};
	
	/**
	 * ふつう
	 */
	this.normal = function(){
		event.startMusic();
		一問時間 = 7 * 1000;
		
		かけ算_第一項範囲 = [2, 9];
		かけ算_第二項範囲 = [2, 9];
		余り = false;
		
		event.countDown();
	};

	/**
	 * むずかしい
	 */
	this.hard = function(){
		event.startMusic();
		一問時間 = 10 * 1000;
		
		かけ算_第一項範囲 = [2, 9];
		かけ算_第二項範囲 = [2, 9];
		余り = true;
		
		event.countDown();
	};
	
	/**
	 * げきむず
	 */
	this.veryhard = function(){
		event.startMusic();
		一問時間 = 3 * 1000;
		
		かけ算_第一項範囲 = [2, 15];
		かけ算_第二項範囲 = [2, 9];
		余り = true;
		event.countDown();
	};
	
	
	/**
	 * カウントダウン開始
	 */
	this.countDown = function() {
		$('#index').hide();
		$('#game').show();
		$('#next').hide();
		$('#answer').hide();
		
		何問目 = 0;
		カービ移動回数 = 0;
		デデデ移動回数 = 0;
		
		開始時間 = new Date();
		
		// 移動距離計算
		一歩距離 = ($('body').get(0).clientWidth - 50) / (問題数 - 1);
		$('#race-kirby').css('left', 0);
		$('#race-dedede').css('left', 0);
		
		var count = 3;
		var text = $('#game-text');
		text.html(count);
		var id = setInterval(function(){
			count--;
			if(count == 0) {
				clearInterval(id);
				event.takeMondai();
				// デデデ走り出す！
				event.runDedede();
			}else {
				text.html(count);
			}
		},1000);
	};
	
	
	/**
	 * 問題を出題する
	 */
	this.takeMondai = function() {
		$('#next').show();
		$('#answer').hide();

		何問目++;
		
		var num2 = Math.floor(Math.random() * (かけ算_第一項範囲[1] - かけ算_第一項範囲[0])) + かけ算_第一項範囲[0];
		var answer = Math.floor(Math.random() * (かけ算_第二項範囲[1] - かけ算_第二項範囲[0])) + かけ算_第二項範囲[0];
		
		var num1 = answer * num2;
		
		var amari = 0;
		if(余り) {
			amari = Math.floor(Math.random() * num2 );
			num1 += amari;
		}
		
		$('#game-text').html(num1 + " ÷ " + num2);
		
		if(amari == 0) {
			$('#answer').html(answer);
		} else {
			$('#answer').html(answer + " … " + amari);
		}
		
	};
	
	
	/**
	 * つぎへ
	 */
	this.next = function(){

		$('#game-text').hide();
		$('#answer').show();
		$('#next').hide();
		
		// ０．５秒で自動的に次の問題へ
		setTimeout(function(){
			
			$('#game-text').show();
			$('#answer').hide();
			$('#next').show();
			event.moveKirby();
			
			// カービゴール
			if(何問目 >= 問題数) {
				
				// 時間計算
				var 終了時間 = new Date();
				var TimeDefference = 終了時間.getTime() - 開始時間.getTime()

				var Hour = TimeDefference / (1000 * 60 * 60);    
				//「時間」の部分を「Hour」に代入
				var Minute = (Hour - Math.floor(Hour)) * 60;
				//「分」の部分をMinuteに代入
				var Second = (Minute - Math.floor(Minute)) * 60;
				//TimeDefference = (('00' + Math.floor(Hour)).slice(-2) + ':' + ('00' + Math.floor(Minute)).slice(-2) + ':' + ('00' + Math.floor(Second)).slice(-2));
				TimeDefference = (('00' + Math.floor(Minute)).slice(-2) + ':' + ('00' + Math.floor(Second)).slice(-2));
				
				$('.time').html(TimeDefference);

				clearInterval(dededeAnimeId);
				
				if(カービ移動回数 > デデデ移動回数) {
					event.win();
				}else{
					event.lose();
				}
				return;
			}
			
			event.takeMondai();
		}, 500);
	};
	
	
	/**
	 * カービィ前へ
	 */
	this.moveKirby = function(){
		カービ移動回数++;
		$('#race-kirby').css('left', カービ移動回数 * 一歩距離);
	};
	
	// デデデアニメのID（時間数以外でクリアするため）
	var dededeAnimeId;
	/**
	 * デデデ走り出す
	 */
	this.runDedede = function(){
		
		dededeAnimeId = setInterval(function(){
			デデデ移動回数++;
			if(デデデ移動回数 >= 問題数) {
				clearInterval(dededeAnimeId);
				event.lose();
				return;
			}
			$('#race-dedede').css('left', デデデ移動回数 * 一歩距離);
			
			// スローカーブースト
			if(デデデ移動回数 < カービ移動回数 - 2) {
				デデデ移動回数++;
				$('#race-dedede').css('left', デデデ移動回数 * 一歩距離);
			}
		},一問時間);
	};
	
	
	/**
	 * かち
	 */
	this.win = function(){
		event.stopMusic();
		var audio = $('#audio-win').get(0);
		audio.play();
		$('#game').hide();
		$('#win').show();
	};
	
	/**
	 * まけ
	 */
	this.lose = function(){
		event.stopMusic();
		var audio = $('#audio-lose').get(0);
		audio.play();
		$('#game').hide();
		$('#lose').show();
	};
	
	/**
	 * さいしょへ戻る
	 */
	this.init = function(){
		$('#game').hide();
		$('#win').hide();
		$('#lose').hide();
		$('#index').show();
	};
};
