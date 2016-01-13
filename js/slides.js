/*  

   _____ _       _                 _  _____ 
  / ___/| (•)   | |               | |/ ___/
 | (___ | |_  __| | ___ ____      | | (___  
  \___ \| | |/ _` |/ _ / __/  _   | |\___ \ 
  ____) | | | (_| |  __\__ \ | |__| |____) |
 /_____/|_|_|\__,_|\___/___/  \____//_____/ 
                                            
                                            
This script is necessary for proper work of your Slides.
Requires plugins.js and jquery-1.11.0 to run this script

http://designmodo.com/slides/

*/

window.inAction = 1;
window.allowSlide = 1;
window.blockScroll = 1;
window.mouseDown = 0;
window.direction = "";
window.slideSpeed = 1000;
window.cleanupDelay = 1450;
window.effectSpeed = 800;
window.horizontalMode = 0;
window.sidebarShown = 0;
window.loadingProgress = 0;
window.customScroll = 1;
window.staticPage = 0;

var $html = $('html');

//Test Device
window.isMobile = false;
if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) { window.isMobile = true; }

//Detect Mobile
if(window.isMobile){$html.addClass('mobile');}

//Detect Browser
window.isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
window.isSafari = /^((?!chrome).)*safari/i.test(navigator.userAgent);
window.isChromeiOS = navigator.userAgent.match('CriOS'); 
window.isMSIE = navigator.userAgent.match('MSIE');
window.isAndroid = navigator.userAgent.toLowerCase().indexOf("android") > -1;
window.isiPad = navigator.userAgent.match(/iPad/i) !== null;

//Detect OS
window.isWindows = navigator.platform.toUpperCase().indexOf('WIN')!==-1;
window.isMac = navigator.platform.toUpperCase().indexOf('MAC')!==-1;
window.isLinux = navigator.platform.toUpperCase().indexOf('LINUX')!==-1;

//Prepare for CSS Fixes
if (window.isSafari){$html.addClass('safari');}
if (window.isFirefox){$html.addClass('firefox');}
if (window.isChrome){$html.addClass('chrome');}
if (window.isMSIE){$html.addClass('msie');}
if (window.isAndroid){$html.addClass('android');}
if (window.isWindows){$html.addClass('windows');}

//Retina
window.isRetina = ((window.matchMedia && (window.matchMedia('only screen and (min-resolution: 124dpi), only screen and (min-resolution: 1.3dppx), only screen and (min-resolution: 48.8dpcm)').matches || window.matchMedia('only screen and (-webkit-min-device-pixel-ratio: 1.3), only screen and (-o-min-device-pixel-ratio: 2.6/2), only screen and (min--moz-device-pixel-ratio: 1.3), only screen and (min-device-pixel-ratio: 1.3)').matches)) || (window.devicePixelRatio && window.devicePixelRatio > 1.3));
if (window.isRetina){$html.addClass('retina');}

//on DOM ready
$(document).ready(function() {  "use strict";
  var $body = $('body');
  
  //fix for android
  if((window.isChromeiOS)||(window.isAndroid)) {
    $body.addClass('simplifiedMobile');
  }
  
  $html.addClass('page-ready');

  //set speed
  if ($body.hasClass('fast')){
    //fast 
    window.slideSpeed = 600;  
    window.cleanupDelay = 1200;
    window.effectSpeed = 600;
  } else if ($body.hasClass('slow')){
    //slow
    window.slideSpeed = 1400;  
    window.cleanupDelay = 2000;
    window.effectSpeed = 1000;
  }
  
  //how many stages?
  window.stage = 1;
	window.stages = $('.slide').size();
  
  //check hash on start
  function updateHash(){
    var isHash = window.location.href.split("#")[1];
    if ((isHash)&&($('.slide[name="' +isHash+ '"]').length>0)) {
      var requestedElement = $('.slide[name="' +isHash+ '"]');
      
      if ((window.isMobile) && ($body.hasClass('simplifiedMobile'))){
        hideSidebar();
        var scrollTop = $(document).scrollTop(),
            finalPosition = scrollTop + requestedElement.offset().top,
            scrollSize = $(document).height() / 10,
            position = finalPosition - scrollSize;
        
        $body.scrollTop(position).animate({
          scrollTop: finalPosition
        }, 500);
      } else {
        window.stage = $('.slide').index(requestedElement) + 1;
      }
    }
  }
  updateHash();
  var isHash = window.location.href.split("#")[1];
  if ((window.debugMode)&&(!isNaN(isHash))) {
    window.stage = Number(isHash);
  }
  
  //preload images
  var imgs = [];
  $("*").each(function() { 
    if($(this).css("background-image") !== "none") { 
      imgs.push($(this).css("background-image").replace(/.*\s?url\([\'\"]?/, '').replace(/[\'\"]?\).*/, '')); 
    } else if ($(this).is('img')){
      imgs.push($(this).attr("src")); 
    }
  });
  
  window.images = imgs.length;
  $.cacheImage(imgs, { complete: function () { window.loadingProgress++; }});
  
  var loadingInterval = setInterval(function(){
    var progress = 50*(window.loadingProgress/window.images);
    $('.loadingIcon .dash').attr('stroke-dasharray',progress+',100');
    $('.loadingIcon').redraw();
    if (window.loaded){
      clearInterval(loadingInterval);
    }
  },800);
  
  if ($body.hasClass('horizontal')){
    window.horizontalMode = 1; 
  }
  
  //is it animated?
  if ($body.hasClass('animated')){
    window.animated = 1;
  }
  
  //is scroll hijacked?
  if ($body.hasClass('defaultScroll')){
    window.customScroll = 0;
  }
  
  //is it static?
  if ($body.hasClass('staticPage')){
    window.staticPage = 1;
  }
  
  
  //on page load
  $(window).load(function(){
    $html.addClass('page-loaded');
    window.inAction = 0;
    window.loaded = 1;
    window.blockScroll = 0;
    
    if (window.animated){
      setTimeout(function(){
        showSlide(window.stage);
      },500);
    }
  });
 
  //initiate slide
  showSlide(window.stage); 
  
  
  
  
  
  
  
   
  /*
         _____ _       _         _____ _                            
        / ___/| (•)   | |       / ___/| |                           
       | (___ | |_  __| | ___  | |    | |__   __ _ _ __   __ _  ___ 
        \___ \| | |/ _` |/ _ \ | |    | '_ \ / _` | '_ \ / _` |/ _ \
        ____) | | | (_| |  __/ | |____| | | | (_| | | | | (_| |  __/
       /_____/|_|_|\__,_|\___/  \____/|_| |_|\__,_|_| |_|\__, |\___/
                                                          __/ |     
       Slide Appearance Manager                          /___/    
  
  */ 
     
  function showSlide(requested){
    
    if ((window.isMobile) && ($body.hasClass('simplifiedMobile'))){
      return;
    }
    
    updateNavigation();
    
    var newSlide = $('.slide').eq(requested - 1),
        currenSlide = $('.slide.selected'),
        currenSlideIndex = currenSlide.index('.slide') + 1;
        
    //cleanup
    hideShare();
    unzoomImage();
    window.allowSlide = 1;
    
    //hide active zoom
    //reset 
    $body.removeClass('sidebarShown lastSlide firstSlide');

    //It it first or last stage?
    if (window.stage === 1){
      $body.addClass('firstSlide');
    }
    if (window.stages === window.stage) {
      $body.addClass('lastSlide');
    }
    
    
    $body.removeClassByPrefix("stage-").addClass('stage-'+window.stage);
    
    //white slide?
    if ( newSlide.hasClass('whiteSlide') ){
      $body.addClass('whiteSlide');
    } else {
      $body.removeClass('whiteSlide');
    }
    
    //prepare slides for transporting
    if (currenSlideIndex !== requested){
      currenSlide.removeClass('selected').removeClass(window.direction).addClass('active');
      newSlide.removeClass('before after').addClass('selected active').addClass(window.direction);
      
      //set order
      newSlide.prevAll('.slide').addClass('before').removeClass('after');
      newSlide.nextAll('.slide').addClass('after').removeClass('before');
    }
    
    //set hash
    if (newSlide.attr('name')) { 
      window.location.hash = newSlide.attr('name'); 
    } else { 
      window.location.hash = "";
      if ((history.pushState)&&(location.protocol !== "file:")) {
        window.history.pushState("", "", location.href.split('#')[0]); 
      }
    }
    
    //prepare to show slide
    newSlide.find('.content').scrollTop(0);
    
    if (window.loaded){
      //animation clear for old slide
      clearTimeout(window.resetOldSlide);
      window.resetOldSlide = setTimeout(function(){
        if (currenSlideIndex !== requested){
          currenSlide.removeClass('active animate');
        }
        newSlide.addClass('animate');
        newSlide.find('.content');
        window.blockScroll = 0;
      },window.slideSpeed);
      
      //prepare animation
      if (window.loaded){
        
        //wait for animation
        window.blockScroll = 1;
        
        //clear element animation on done
        $('.done').removeClass('done');
        clearTimeout(window.clearElementAnimation);
        window.clearElementAnimation = setTimeout(function(){
          $(".selected [class*='ae-']").addClass('done');
        }, window.slideSpeed + window.effectSpeed + window.cleanupDelay);
      }
    }
    
    //debug mode
    if (window.debugMode) { window.location.hash = requested; }
  }
  
  //remove animation from a clickable element
  $(".animated [class*='ae-']:not('.done')").click(function(){ $(this).addClass('done'); });
  
  
  //Change slide
  function changeSlide(n){
		if (n === "increase"){
			if ((window.stage + 1) >= window.stages){
				n = window.stages;
			} else {
				n = window.stage + 1;
			}
		} else if (n === "decrease"){
			if ((window.stage - 1) < 1){
				n = 1;
			} else {
				n = window.stage - 1;
			}
		}
		
		if (n !== window.stage){
			if (window.inAction !== 1){	
			  window.inAction = 1;
				window.stage = n;
				showSlide(window.stage);
				setTimeout(function(){ window.inAction = 0; }, window.slideSpeed);
			}
		}
	}
  
  $('.nextSlide').on('mouseup touchstart', function(){
    changeSlide('increase');
  });
  
  $('.prevSlide').on('mouseup touchstart', function(){
    changeSlide('decrease');
  });
  
  //zoom out image
  function unzoomImage(){
    if ($('.zoom-overlay-open').length > 0){
      setTimeout(function(){
        $('.zoom-img').click();
      },window.slideSpeed);
    }
  } 
  
  
  
  
  
  
  
   
       /*                   |
                *               .   
       .        |               |
       |                .           
         _____          |     _ _   
        / ___/               | | | 
       | (___   ___ _ __ ___ | | |
        \___ \ / __| '_   _ \| | | 
        ____) | (__| | | (_) | | | 
       |_____/ \___|_|  \___/|_|_|
    
       #scrolling */

  $('.slides').bind('mousewheel resize', function(event){
    
    window.energy = event.originalEvent.wheelDelta;
    window.scrollsize = Math.abs(Math.round(event.deltaY));
    var currentSection = $('.slide.selected .content'),
        curSecScrolltop = $(currentSection).scrollTop(),
        currentSectionHeight = $(currentSection).find('.container').outerHeight(),
        minScrollSize = 30;
    
    //fix windows scroll
    if (!event.originalEvent.wheelDelta) {
      window.energy = event.deltaY * event.deltaFactor;
    }
    if ((window.isWindows)||(window.isLinux)){
      minScrollSize = 1;
      window.scrollsize = Math.abs(event.deltaY) * event.deltaFactor;
    }
    
    //detect direction of scroll
    if (event.deltaY >= 0){
      window.scrollDirection = "up";
    } else {
      window.scrollDirection = "down";
    }
    
    //position
    if (window.scrollDirection === "up") {
      curSecScrolltop = curSecScrolltop - window.scrollsize;
    } else if (window.scrollDirection === "down") {
      curSecScrolltop = curSecScrolltop + window.scrollsize;
    }

    //scroll for static pages
    if (window.staticPage) {
      $(currentSection).scrollTop(curSecScrolltop);
    }
    
    // scroll oversized content
    if ((currentSectionHeight > $(window).height()) && (!window.staticPage)){
      
      window.allowSlide = 0;
        
      if (( window.scrollDirection === "up" ) && ( $(currentSection).scrollTop() === 0 )){
        window.allowSlide = 1;
      } else if (( window.scrollDirection === "down" ) && ( $(currentSection).scrollTop() + $(window).height() >= currentSectionHeight )){
        window.allowSlide = 1;
      }
          
      if ((!window.sidebarShown)&&(!window.popupShown)&&(!window.blockScroll)) {
         
        if (window.customScroll){
          
          //lock default scroll
          event.preventDefault();
          //smooth scroll
          var energy = window.energy;
          
          if (energy > 1500) { energy = 1500; }
          if (energy < -1000) { energy = -1500; }
          
          var delta = energy/120,
              scrollTime = 0.5,
              scrollDistance = 100,
              scrollTop = curSecScrolltop,
              finalScroll = scrollTop - parseInt(delta*scrollDistance);
            
          TweenLite.to($(currentSection), scrollTime, {
            scrollTo : { y: finalScroll, autoKill:true },
            ease: Power1.easeOut,
            overwrite: 5							
          });
          
        } else {
          if (!window.isWindows){
            $(currentSection).scrollTop(curSecScrolltop);
          }
        }
      }
        
    //end scroll oversized content
    }
    
    //change slide on medium user scroll
    if ((window.scrollsize >= minScrollSize) && (window.allowSlide) && (!window.sidebarShown) && (!window.popupShown)){
        
      //should we even.. 
      if ((window.scrollDirection === "down" && window.stage !== window.stages)||(window.scrollDirection === "up" && window.stage !== 1)){
        
        //ok let's go
        if (window.inAction !== 1){
            
          //we are animating
          window.inAction = 1;
          
          // up or down?
          if (window.scrollDirection === "down"){
            window.stage++;
          } else if (window.scrollDirection === "up"){
            window.stage--;
          }
            
          //set range of stages
          if (window.stage > window.stages){
            window.stage = window.stages;
          } else if (window.stage < 1){
            window.stage = 1;
          }
          showSlide(window.stage);
                  
          //we are done
          setTimeout(function(){ window.inAction = 0;}, window.slideSpeed);
        }
      }
    }
  
    //end on scroll event
  }); 
  
  
  
  
  
  
   
  /* 
         ______                      
        / ____/       (•)
       | (_____      ___ _ __   ___ 
        \___ \ \ /\ / | | '_ \ / _ \
        ____) \ V  V /| | |_) |  __/
       /_____/ \_/\_/ |_| .__/ \___/
                        | |                
       Swipe Event      |_|           
  */


  $('.mobile .slides:not(.simplifiedMobile):not(.simplified)').swipe({
    swipeStatus:function(event, phase, direction, distance){
      
      window.allowSwipeUp = 1;
      window.allowSwipeDown = 1;
          
      //set height for current slide
      var currentSection = $('.slide.selected .content'),
          currentSectionHeight = $(currentSection).find('.container').outerHeight(),
          next = "up",
          prev = "down",
          minDistanceMobile = 30,
          windowHeight = window.innerHeight;
          
      if (window.sidebarShown){
        currentSection = $('.sidebar .content');
      } 
      
      if (window.popupShown){
        currentSection = $('.popup .content');
      }
      
      if (phase === "start") {
        window.scrollTop = $(currentSection).scrollTop();
      }
          
      //horizontal mode
      if (window.horizontalMode){
        next = "left";
        prev = "right";
      }
      
      //lock slide
      if ( (!window.horizontalMode) && ( currentSectionHeight > windowHeight) ){
        if (window.scrollTop + windowHeight < currentSectionHeight){
          window.allowSwipeUp = 0;
        } else if (window.scrollTop > 0) {
          window.allowSwipeDown = 0;
        }
      }
      
      if (!window.sidebarShown) {
        // MOBILE
        if (window.horizontalMode){
          if (direction === next && distance > minDistanceMobile){
            changeSlide('increase');
          } else if (direction === prev && distance > minDistanceMobile){
            changeSlide('decrease');
          }
        } else {
          if (direction === next && distance > minDistanceMobile && window.allowSwipeUp && window.allowSlide){
            changeSlide('increase');
          } else if (direction === prev && distance > minDistanceMobile && window.allowSwipeDown && window.allowSlide){
            changeSlide('decrease');
          }
        }
      }
    },
    maxTimeThreshold:30,
    fingers:'all',
    allowPageScroll:"vertical"
  });
  
  
  
  
  
   
  /*    _____                 _       
       |  __ \               | |
       | |__) __ _ _ __   ___| |____
       |  ___/ _` | '_ \ / _ | | __/
       | |  | (_| | | | |  __| |__ \
       |_|   \__,_|_| |_|\___|_|___/
    
       Responsive Panels              */
      
  if($('.panel .compact').length > 0){
    
    $('.panel .compact').each(function(index, element) {
			var panel = $(element).parents('.panel'),
          desktop = $(panel).find('.desktop'),
          compact = element,
          forceMobileView = $(panel).hasClass('forceMobileView');
      
      $(window).on('load resize',function(){
        
        if ((window.isMobile || $(document).width() < 767) && forceMobileView) {
        
          $(desktop).addClass('hidden');
          $(compact).removeClass('hidden');
        
        } else {
          
          $(desktop).removeClass('hidden');
          $(compact).addClass('hidden');
          
          var totalWidth = 0;
          
          desktop.children().each(function(){
            if ( $(this).outerWidth() > $(this).children().outerWidth() ){
              totalWidth += Math.round($(this).outerWidth());
            } else {
              totalWidth += Math.round($(this).children().outerWidth());
            }
          });
          
          // if width of space is not enough or we are on mobile
          if ((totalWidth + Math.round($(document).width()*0.1) > $(document).width() + 2 ) || ((window.isMobile || $(document).width() < 767) && forceMobileView)) {
            $(desktop).addClass('hidden');
            $(compact).removeClass('hidden');
          } else {
            $(desktop).removeClass('hidden');
            $(compact).addClass('hidden');
          }
        }
          
      });
      
    });
  } 
  
  
  
  
  
  
  
   
  /*
         _  __              
        | |/ /              
        | ' / ___ _   _ ____
        |  < / _ \ | | / __/
        | . \  __/ |_| \__ \
        |_|\_\___/\__, |___/
                   __/ |    
                  |___/    
   
        Listen user keys 
                                   */
   
	$(window).on("keydown",function(e){
    var delta = 2.5,
        scrollTime = 0.5,
        scrollDistance = 50,
        currentSection = $('.slide.selected .content'),
        scrollTop = $(currentSection).scrollTop(),
        finalScroll = scrollTop + parseInt(delta*scrollDistance);

		
		/* [ ← ] */
		if (e.keyCode === 37){
			if (window.horizontalMode){ changeSlide('decrease'); }
		}
    
		/* [ ↑ ] */
		if (e.keyCode === 38){
			if (!window.horizontalMode){
        changeSlide('decrease');
      }  else {
            
        TweenLite.to($(currentSection), scrollTime, {
          scrollTo : { y: finalScroll, autoKill:true },
          ease: Power1.easeOut,
          overwrite: 5							
        });
      }
		}
		
		/* [ → ] */
		if (e.keyCode === 39){
		  if (window.horizontalMode){ changeSlide('increase'); }
		}
    
		/* [ ↓ ] */
		if (e.keyCode === 40){
      if (!window.horizontalMode) {
         changeSlide('increase');
      } else {
            
        TweenLite.to($(currentSection), scrollTime, {
          scrollTo : { y: finalScroll, autoKill:true },
          ease: Power1.easeOut,
          overwrite: 5							
        });
      }
		}
		
		/* [ esc ] */
		if (e.keyCode === 27){
			hideSidebar();
      hideShare();
      hidePopup();
      unzoomImage();
		}
	}); 
  
  
  
  
  
  
  
   
  /*
       _   _                           _                 
      | \ | |           ( )           | | ( )                 •
      |  \| | __ ___   ___  __ _  __ _| |_ _  ___  _ __       •
      | . ` |/ _` \ \ / | |/ _` |/ _` | __| |/ _ \| '_ \     (•)
      | |\  | (_| |\ V /| | (_| | (_| | |_| | (_) | | | |     •
      |_| \_|\__,_| \_/ |_|\__, |\__,_|\__|_|\___/|_| |_|     •
                            __/ |
      Generate navigation  /___/               
  */
  
  
  
  var navParent = $('.navigation');
  var navigation = $(navParent).find('ul');
  
  if ($(navigation).length > 0) {
  
    $(navigation).empty();
    
    $(navigation).each(function(index, element) {
      for (var i = 1; i <= window.stages; i++){
        var title = $('.slide:eq('+(i - 1)+')').data('title');
        if (title === undefined) { 
          
          if (window.debugMode) {
            $(element).append('<li class="tooltip" data-title="#'+i+'"></li>');
          } else {
            $(element).append('<li></li>');
          }
        
        } else {
          $(element).append('<li class="tooltip" data-title="'+title+'"></li>');
        }
      }
    });
    
    //Navigation clicks
    $('.navigation li').on("click touchend", function(){
      changeSlide($(this).index() + 1);
    });
    
    //Collaps to compact
    $(window).on('load resize',function(){
      var containerWidth = $(window).height() - $(window).width()*0.1112 - 100,
          container = $('.side').removeClass('compact').find('ul'),
          totalWidth = 0;
      
      $(container).children().each(function(){
        if ( $(this).outerWidth() > $(this).children().outerWidth() ){
          totalWidth += Math.round($(this).outerWidth());
        } else {
          totalWidth += Math.round($(this).children().outerWidth());
        }
      });
      
      if (totalWidth > containerWidth){
        $('.side').addClass('compact');
      } else {
        $('.side').removeClass('compact');
      }
    });
  }
  
  //In-page Navigation
  $("a[href^=#][target!='_blank']").click(function(e){
    
    var hashLink = $(this).attr('href').split('#')[1];
    if( (hashLink) && ( $('.slide[name="' +hashLink+ '"]').length > 0) ){
      var requestedElement = $('.slide[name="' +hashLink+ '"]');
      
      if ((window.isMobile) && ($body.hasClass('simplifiedMobile'))){
        hideSidebar();
        var scrollTop = $(document).scrollTop(),
            finalPosition = scrollTop + requestedElement.offset().top,
            scrollSize = $(document).height() / 10,
            position = (scrollTop < finalPosition) ? finalPosition - scrollSize : finalPosition + scrollSize;
        
        $body.scrollTop(position).animate({
          scrollTop: finalPosition
        }, 500); 
      } else {
        e.preventDefault();
        window.stage = $('.slide').index(requestedElement) + 1;
        showSlide(window.stage);
      }
    }
  });
  
  //Update Navigation
  function updateNavigation(){
    setTimeout(function(){
      if ( $(navigation).length > 0 ){
        $(navigation).each(function(index, element) {
          $(element).find('li.selected').removeClass('selected');
          $(element).find('li').eq(window.stage - 1).addClass('selected');
				});
      }
    },5);
  } 
  
  
  
  
  
  
  
   
  /*     _____       _      _                 ☰   
        / ____(•)   | |    | |                
       | (___  _  __| | ___| |__   __ _ _ __   
        \___ \| |/ _` |/ _ | '_ \ / _` | '_/
        ____) | | (_| |  __| |_) | (_| | |   
       |_____/|_|\__,_|\___|_.__/ \__,_|_|   
                                             
       Sidebar Toggle                         */

  $('.sidebarTrigger').on('click', function(){
    
    var sidebarID = $(this).data('sidebar-id'),
        element = $('.sidebar[data-sidebar-id="' + sidebarID + '"]');
    
    if (element.length > 0) {
      window.sidebarShown = 1;
      window.allowSlide = 0;
      $(element).addClass('visible');
      $body.addClass('sidebarShown');
      $(element).find('.content').scrollTop(0);
    }
    
    //clean up
    hideShare();
  });
  
  //Hide on click outside
  $(document).on('mouseup touchstart', function (e){
    var container = $(".sidebarShown .sidebar, .dropdownTrigger");
    if (!container.is(e.target) && container.has(e.target).length === 0) {
      hideSidebar();
    }
  });
  
  //Hide on .close Click
  $('.sidebar .close').on('click touchstart', function(){
    hideSidebar();
  });
  
  function hideSidebar(){
    $body.removeClass('sidebarShown');
    $('.sidebar').removeClass('visible');
    window.sidebarShown = 0;
     window.allowSlide = 1;
  } 
  
  
  
  
  
  
  
   
  /*    _____                           __
       |  __ \           _   _ _ __    |  |_
       | |__) ___  _ __ | | | | '_ \   |__| |
       |  ___/ _ \| '_ \| | | | |_) |    |__|
       | |  | (_) | |_)  \__,_| .__/
       |_|   \___/| .__/      | |    
                  | |         |_|    
       Popup! Up! |_|                      */
                
  $('.popupTrigger').on('click', function(){
    
    var sidebarID = $(this).data('popup-id'),
        element = $('.popup[data-popup-id="' + sidebarID + '"]');
    
    if (element.length > 0) {
      $(element).addClass('visible');
      $body.toggleClass('popupShown');
      $(element).scrollTop(0);
      window.allowSlide = 0;
      window.popupShown = 1;
    }
    
    //clean up
    hideShare();
  });
  
  function hidePopup() {
    //stop video on close
    var el = $('.popupShown .popup.visible iframe');
    $(el).attr('src', $(el).attr('src'));
    
    $body.removeClass('popupShown');
    $('.popup.visible').removeClass('visible');
    
    window.allowSlide = 1;
    window.popupShown = 0;
  }
  
  //Hide on body click
  $(document).on('click touchend', function (e){
    var container = $(".popupShown .popup .popupContent, .popupTrigger");
    if (!container.is(e.target) && container.has(e.target).length === 0 && container.length > 0) {
      hidePopup();
    }
  });
  
  //Hide on .close Click
  $('.popup .close').on('click touchstart', function(){
    hidePopup();
  }); 
  
  
  
  
  
  
  
   
  /*     _____ ______ ______ 
        / ____|  ___/|  ___/
       | |  _ | |__  | |__   
       | | |_\|  __/ |  __/  
       | |__| | |____| |____ 
        \____/|_____/|_____/
                             
       Grid Element Equalizer    */
  
  $(window).on('resize load',function(){
    equalizeELements();
  });
    
  function equalizeELements(){
    
    var gridEl = $('.grid.equal');
    if (gridEl.length) {
      $(gridEl).each(function(index, element) {
          
        var screenWidth = $(window).width(),
            collapseWidth = ($(element).hasClass('later')) ? 767 : 1024,
            equalElement = $(element).find('.equalElement'),
            equalMobile = $(element).find('.equalMobile');
                
        if ((screenWidth >= collapseWidth)||(equalMobile)){
          var height = 0;
              
          //fetch max height
          $(equalElement).each(function(index, el) {
            
            $(el).css('height','auto');
            
            if (height < $(el).outerHeight()) {
              height = $(el).outerHeight();
            }
            
          });
              
          //apply
          $(element).find('.equalElement').each(function(index, el) {
            $(el).css('height',height + "px");
          });
        } else {
          $(equalElement).css("height",'auto');
        }
      });
    }
  }
 
 
  //Detect Resize
  $(window).on('resize',function(){
    $html.addClass('resizing');
  }).on('resizeEnd',function(){
    $html.removeClass('resizing');
  }); 
  
  
  
  
  
  
  
   
  /*     _____ _       _           
        / ____| (•)   | |          
       | (___ | |_  __| | ___ _ __ 
        \___ \| | |/ _` |/ _ \ '_/
        ____) | | | (_| |  __/ |   
       |_____/|_|_|\__,_|\___/_|   
                                   
                                                           
       Slider     • •(•)• •        */
  
  
  var sliderEl = $('.slider');
  
  if ($(sliderEl).length > 0) {
    $(sliderEl).each(function(index, element) {
      
      if ($(element).hasClass('clickable')){    
        $(element).on('mousedown', function(){
  
          var el = $(this),
              selected = $(el).find('.selected'),
              nextElement = $(selected).nextOrFirst('li'),
              nextIndex = $(nextElement).index(),
              sliderID = $(el).data('slider-id'),
              controller = $('.controller[data-slider-id="'+sliderID+'"]');
               
          //select next
          $(selected).removeClass('selected');
          $(nextElement).addClass('selected');
                    
          if ( (sliderID) && ($(controller).length > 0) ){
            $(controller).find('.selected').removeClass('selected');
            $(controller).children('li:eq('+nextIndex+')').addClass('selected');
          }
        });
      }
		});
  }
  
  var controller = $('.controller');
  
  if ($(controller).length > 0) {
    $(controller).find('li').each(function(index, element) {
      
			 $(element).on('mousedown', function(){
         var controllerElement = $(this),
             selectedElement = $(controllerElement).closest('.controller').find('.selected'),
             elementIndex = $(this).index(),
             controllerId = $(controllerElement).closest('.controller').data('slider-id');
         
         if (!$(controllerElement).hasClass('selected')){
            $(selectedElement).removeClass('selected');
            $(controllerElement).addClass('selected');
            $('.slider[data-slider-id="'+controllerId+'"]').find('.selected').removeClass('selected');
            $('.slider[data-slider-id="'+controllerId+'"]').children('li:eq('+elementIndex+')').addClass('selected');
         }
       });
      
    });
  } 
  
  
  
  
  
  
  
   
  /*     _____ _                    
        / ___/| |                   
       | (___ | |__   __ _ _ __ ___ 
        \___ \| '_ \ / _` | '__/ _ \
        ____) | | | | (_| | | |  __/
       /_____/|_| |_|\__,_|_|  \___/
    
       Share Window Appereance and Performance */
       
       
  window.dropdownShown = false;
  $('.dropdownTrigger').click(function(){
    if (window.dropdownShown){
      hideShare();
    } else {
      //show
      
      var offset = $(this).offset(),
          offsetY = Math.ceil(offset.top),
          offsetX = Math.ceil(offset.left),
          shareID = $(this).data('dropdown-id'),
          element = $('.dropdown[data-dropdown-id="' + shareID + '"]');
      
      clearTimeout(window.hideDropdown);
      
      if ( $(element).hasClass('bottom') ) {
        offsetY = offsetY - $(element).outerHeight();
      } else {
        offsetY = offsetY + $(this).outerHeight();
      }
      
      if ( $(element).hasClass('right') ) {
        offsetX = offsetX - $(element).outerWidth() + $(this).outerWidth();
      }
      
      $(element).removeClass('show hide').addClass('show').css('top',offsetY).css('left',offsetX);
      $body.addClass('dropdownShown');
      window.dropdownShown = true;
    }
  });
  
  function hideShare(){
    //hide
    if (window.dropdownShown){
      $('.dropdown').addClass('hide');
      window.hideDropdown = setTimeout(function(){
        $('.dropdown').removeClass('show hide');
        $body.removeClass('dropdownShown');
      },500);
      window.dropdownShown = false;
    }
  }
  
  
  //remove on resize
  $(window).on('resize',function(){ 
    if (window.dropdownShown) {
      $('.dropdown').removeClass('show');
      $body.removeClass('dropdownShown');
      window.dropdownShown = false;
    }
  });
  
  //remove on click outside
  $(document).on('mouseup touchstart', function (e){
    var container = $(".dropdownShown .dropdown");
    if (!container.is(e.target) && container.has(e.target).length === 0) {
      hideShare();
    }
  });
  
  //set url for share
  window.shareUrl = window.location.href;
  if ($('.share').data('url')) {
    window.shareUrl = $('.dropdown').data('url');
  }
  //set text for share
  window.shareText = document.title;
  if ($('.share').data('text')) {
    window.shareText = $('.dropdown').data('url');
  }
  
  $('.share').sharrre({
    enableHover: false,
    shorterTotal: true,
    url: window.shareUrl,
    text: window.shareText,
    enableCounter: false,
    share: {
      twitter: true,
      facebook: true,
      pinterest: true,
      googlePlus: true,
      stumbleupon: true,
      linkedin: true
    },
    
    buttons: {
      pinterest: {
        media: $('.dropdown').data('pinterest-image'),
        description: $('.dropdown').data('text') + " " + $('.dropdown').data('url')
      }
    },
    
    template: $('.share').html(),
    
    render: function(api) {
      
      $(api.element).on('click touchstart', '.twitter', function() {
        api.openPopup('twitter');
      });
      $(api.element).on('click touchstart', '.facebook', function() {
        api.openPopup('facebook');
      });
      $(api.element).on('click touchstart', '.pinterest', function() {
        api.openPopup('pinterest');
      });
      $(api.element).on('click touchstart', '.googlePlus', function() {
        api.openPopup('googlePlus');
      });
      $(api.element).on('click touchstart', '.stumbleupon', function() {
        api.openPopup('stumbleupon');
      });
      $(api.element).on('click touchstart', '.linkedin', function() {
        api.openPopup('linkedin');
      });
      $(api.element).on('click touchstart', '.mail', function() {
        
        var subject = ($(this).data('subject') ? $(this).data('subject') : "");
        var body = ($(this).data('body') ? $(this).data('body') : "");
        var url = window.location.href;
        if ( $('.dropdown').data('url') ) { url = $('.dropdown').data('url'); }
        //open email
        window.location.href ="mailto:?Subject=" + encodeURIComponent( subject ) + "&Body=" + encodeURIComponent( body ) + " " + url;
      });
      
    }
  });  
  
// end on dom ready
});