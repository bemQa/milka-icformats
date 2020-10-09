$(document).ready(function() {
    $('.burger').click(function(e) {
        e.preventDefault();
        (this.classList.contains("active") === true) ? this.classList.remove("active"): this.classList.add("active");

        $('.menu-links').toggleClass('active');
        $('body').on('click', function(e) {
            var div = $('.menu-links, .burger');

            if (!div.is(e.target) && div.has(e.target).length === 0) {
                div.removeClass('active');
            }
        });
    });

    $('.anchor[href^="#"]').click(function() {
        if ($(window).innerWidth() <= 1000) {
            $('.menu-links').removeClass('active');
            $('.burger').removeClass('active');
        }
        elementClick = $(this).attr("href");
        destination = $(elementClick).offset().top - 50;
        $('html, body').animate({ scrollTop: destination }, 500, 'swing');
        return false;
    });

    if (window.innerWidth > 1000) {
        $(window).on('scroll load', function() {
            var top = $(window).scrollTop();
            var href = $('.anchor').attr('href');
            if (top >= 1600) {
                $('header').addClass('fixed');
            } else {
                $('header').removeClass('fixed');
            }
            $('.wrapper section').each(function() {
                var destination = $(this).offset().top - 50;
                if (top >= destination) {
                    var id = $(this).attr('id');
                    $('.anchor[href^="#"]').removeClass('active');
                    $('.anchor[href^="#' + id + '"]').addClass('active');
                }
            });
        });
    }

    setTimeout(function() {
        $('.edadil').addClass('active');
    }, 5000);

    $('.close-edadil').on('click', function(e) {
        e.preventDefault();
        $('.edadil').removeClass('active');
    });

    $('.how-play').click(function(e){
        e.preventDefault();
        $(this).next().toggleClass('active');

        $('body').on('click', function(e) {
            var div = $('.tooltip, .how-play');

            if (!div.is(e.target) && div.has(e.target).length === 0) {
                div.removeClass('active');
            }
        });
    });
});

// game
if(document.getElementById('puzzle')) {
    var puzzle = document.getElementById('puzzle');
    var context = puzzle.getContext('2d');

    var img1 = new Image();
    img1.src = 'img/game/coffee.png';
    if (window.innerWidth < 1000) {
        img1.src = 'img/game/coffee-mob.png';
    }

    var img2 = new Image();
    img2.src = 'img/game/home.png';
    if (window.innerWidth < 1000) {
        img2.src = 'img/game/home-mob.png';
    }

    var img3 = new Image();
    img3.src = 'img/game/study.png';
    if (window.innerWidth < 1000) {
        img3.src = 'img/game/study-mob.png';
    }

    var img4 = new Image();
    img4.src = 'img/game/work.png';
    if (window.innerWidth < 1000) {
        img4.src = 'img/game/work-mob.png';
    }

    var img5 = new Image();
    img5.src = 'img/game/travel.png';
    if (window.innerWidth < 1000) {
        img5.src = 'img/game/travel-mob.png';
    }

    var img = img1;
    img.addEventListener('load', drawTiles, false);

    var boardSize = 500;
    if (window.innerWidth < 1000) {
        boardSize = 250;
        puzzle.setAttribute('width', 250);
        puzzle.setAttribute('height', 250);
    }
    var tileCount = 3;

    var tileSize = boardSize / tileCount;

    var clickLoc = new Object;
    clickLoc.x = 0;
    clickLoc.y = 0;

    var emptyLoc = new Object;
    emptyLoc.x = 0;
    emptyLoc.y = 0;

    var solved = false;

    var boardParts;
    var goodBoard;

    var empx=0;
    var empy=0;
    var mousex=0,mousey=0;
    var mouseboardLeft=0,mouseboardTop=0;

    var arr_highlight=[];

    initSlider();

    function reInit() {
        setBoard();
        shuffleBoard();
        solved=false;
        drawTiles();
        highlight();
    }

    function initSlider() {

        $(".game-slider").slick({
            dots: false,
            arrows: true,
            slidesToShow: 1,
            slidesToScroll: 1,
            infinite: true,
            speed: 500,
            fade: true,
            cssEase: 'linear'
        });

        var active = $('.game-slide.slick-active');
        var step = active.data('step');

        $(".game-slider").on('afterChange', function(event, slick, currentSlide, nextSlide) {
            active = $('.game-slide.slick-active');
            step = active.data('step');
            $('.game-slide .game-puzzle-win').removeClass('active');
            $('.game-nav').removeClass('active');
            $('.game-nav[data-step=' + step + ']').addClass('active');

            if (step == 1) {
                img = img1;
                active.find('.canvas-container').append(puzzle);
                reInit();
            } else if (step == 2) {
                img = img2;
                active.find('.canvas-container').append(puzzle);
                reInit();
            } else if (step == 3) {
                img = img3;
                active.find('.canvas-container').append(puzzle);
                reInit();
            } else if (step == 4) {
                img = img4;
                active.find('.canvas-container').append(puzzle);
                reInit();
            } else if (step == 5) {
                img = img5;
                active.find('.canvas-container').append(puzzle);
                reInit();
            }
        });

        $('.game-nav').click(function(e) {
            e.preventDefault();
            var step_nav = $(this).data('step') - 1;
            $('.game-nav').removeClass('active');
            $(this).addClass('active');
            $(".game-slider").slick('slickGoTo', step_nav);
        });

        $('.game-puzzle-win-btn').click(function(e) {
            e.preventDefault();
            solved = false;
            var step_next = $(this).parents('.game-slide').data('step');
            if (step_next == 5) {
                $(".game-slider").slick('slickGoTo', 0);
            } else {
                $(".game-slider").slick('slickGoTo', step_next);
            }
        });

        reInit();
    }

    document.getElementById('puzzle').onclick = function(e) {
        var boardTop = document.getElementById('puzzle').getBoundingClientRect().top + window.scrollY;
        var boardLeft = document.getElementById('puzzle').getBoundingClientRect().left;
        clickLoc.x = Math.floor((e.pageX - boardLeft) / tileSize);
        clickLoc.y = Math.floor((e.pageY - boardTop) / tileSize);
        if (distance(clickLoc.x, clickLoc.y, emptyLoc.x, emptyLoc.y) == 1) {
            slideTile(emptyLoc, clickLoc);
            drawTiles();
        }
        if (solved) {
            $('.game-slide .game-puzzle-win').removeClass('active');
            $('.game-slide.slick-active .game-puzzle-win').addClass('active');
            solved = false;
        }
    };


    //
    function draw_highlight(el){
        context.fillStyle='#FFDD00';
        context.fillRect(el.x*tileSize, el.y*tileSize, tileSize, 5);
        context.fillRect(el.x*tileSize, el.y*tileSize, 5, tileSize);
        context.fillRect(el.x*tileSize+tileSize-5, el.y*tileSize, 5, tileSize);
        context.fillRect(el.x*tileSize, el.y*tileSize+tileSize-5, tileSize, 5);

    }

    function highlight(){
        arr_highlight=[];
        for (var i = 0; i < tileCount; i++) {
            for (var j = 0; j < tileCount; j++) {
                if (distance(boardParts[i][j].x, boardParts[i][j].y, emptyLoc.x, emptyLoc.y) == 1) {
                    arr_highlight.push(boardParts[i][j]);
                }
            }
        }

        document.getElementById('puzzle').onmousemove = function(e) {
            drawTiles();
            mouseboardTop = document.getElementById('puzzle').getBoundingClientRect().top + window.scrollY;
            mouseboardLeft = document.getElementById('puzzle').getBoundingClientRect().left;
            mousex = Math.floor((e.pageX - mouseboardLeft) / tileSize);
            mousey = Math.floor((e.pageY - mouseboardTop) / tileSize);

            for (var i = 0; i < arr_highlight.length; i++) {
                    if(arr_highlight[i].x==mousex && arr_highlight[i].y==mousey){
                        draw_highlight(arr_highlight[i]);
                    }
            }

        }

    }

    function setBoard() {
        boardParts = new Array(tileCount);
        goodBoard = new Array(tileCount);
        for (var i = 0; i < tileCount; ++i) {
            boardParts[i] = new Array(tileCount);
            goodBoard[i] = new Array(tileCount);
            for (var j = 0; j < tileCount; ++j) {
                boardParts[i][j] = new Object;
                boardParts[i][j].x = (tileCount - 1) - i;
                boardParts[i][j].y = (tileCount - 1) - j;
                goodBoard[i][j] = new Object;
                goodBoard[i][j].x = i;
                goodBoard[i][j].y = j;
            }
        }
        emptyLoc.x = boardParts[tileCount - 1][tileCount - 1].x;
        emptyLoc.y = boardParts[tileCount - 1][tileCount - 1].y;
        solved = false;
    }

    function shuffleBoard() {
        for (var i = 0; i < tileCount; i++) {
            for (var j = 0; j < tileCount; j++) {
                k = parseInt(Math.random() * (tileCount - 1));
                l = parseInt(Math.random() * (tileCount - 1));
                tempx = boardParts[i][j].x;
                tempy = boardParts[i][j].y;
                boardParts[i][j].x = boardParts[k][l].x;
                boardParts[i][j].y = boardParts[k][l].y;
                boardParts[k][l].x = tempx;
                boardParts[k][l].y = tempy;

                if (emptyLoc.x == boardParts[i][j].x && emptyLoc.y == boardParts[i][j].y) {
                    emptyLoc.x = boardParts[k][l].x;
                    emptyLoc.y = boardParts[k][l].y;
                } else if (emptyLoc.x == boardParts[k][l].x && emptyLoc.y == boardParts[k][l].y) {
                    emptyLoc.x = boardParts[i][j].x;
                    emptyLoc.y = boardParts[i][j].y;
                }
                empx=emptyLoc.x;
                empy=emptyLoc.y;
            }
        }
    }

    function drawTiles() {
        context.clearRect(0, 0, boardSize, boardSize);
        for (var i = 0; i < tileCount; ++i) {
            for (var j = 0; j < tileCount; ++j) {
                var x = boardParts[i][j].x;
                var y = boardParts[i][j].y;
                if (i != emptyLoc.x || j != emptyLoc.y || solved == true) {
                    if(solved==true && i==emptyLoc.x && j==emptyLoc.y){
                        context.drawImage(img, emptyLoc.x * tileSize, emptyLoc.y * tileSize, tileSize, tileSize,
                            i * tileSize, j * tileSize, tileSize, tileSize);
                    }
                    else{
                        context.drawImage(img, x * tileSize, y * tileSize, tileSize, tileSize,
                            i * tileSize, j * tileSize, tileSize, tileSize);
                    }
                }
            }
        }
    }

    function distance(x1, y1, x2, y2) {
        return Math.abs(x1 - x2) + Math.abs(y1 - y2);
    }

    function slideTile(toLoc, fromLoc) {
        //if (!solved) {

                tempx = toLoc.x;
                tempy = toLoc.y;

            boardParts[toLoc.x][toLoc.y].x = boardParts[fromLoc.x][fromLoc.y].x;
            boardParts[toLoc.x][toLoc.y].y = boardParts[fromLoc.x][fromLoc.y].y;
            boardParts[fromLoc.x][fromLoc.y].x = tempx;
            boardParts[fromLoc.x][fromLoc.y].y = tempy;
            toLoc.x = fromLoc.x;
            toLoc.y = fromLoc.y;
            checkSolved();
        //}
        highlight();
    }

var check_count=0;

    function checkSolved() {
        check_count++;
        var flag = true;
        for (var i = 0; i < tileCount; i++) {
            for (var j = 0; j < tileCount; j++) {
                if ( !(i==emptyLoc.x && j==emptyLoc.y) && (boardParts[i][j].x != goodBoard[i][j].x || boardParts[i][j].y != goodBoard[i][j].y)) {
                    flag = false;
                    solved = flag;
                    return;
                }
            }
        }
        solved = flag;
    }
}

// scrollmagic

// init controller
var controller = new ScrollMagic.Controller();

$(window).on('load', function() {
    $('.animation1, .animation2').fadeIn();
});

function scrollAnimation() {
    // build tween
    var tween_camera = TweenMax.staggerFromTo(".camera", 1, 
        {
            top: -400,
            left: -1500
        }, 
        {
            top: -350,
            left: -1000, 
            ease: Linear.easeNone
        }, 1);
    var tween_focustl = TweenMax.staggerFromTo(".focus-white-top-left", 1, 
        {
            top: -290,
            left: 0
        }, 
        {
            top: -280,
            left: 300, 
            ease: Linear.easeNone
        }, 1);
    var tween_phone = TweenMax.staggerFromTo(".phone", 1, 
        {
            top: -400,
            right: -1610
        }, 
        {
            top: -350,
            right: -1100, 
            ease: Linear.easeNone
        }, 1);
    var tween_focustr = TweenMax.staggerFromTo(".focus-white-top-right", 1, 
        {
            top: -290,
            right: 0
        }, 
        {
            top: -280,
            right: 300, 
            ease: Linear.easeNone
        }, 1);
    var tween_glasses = TweenMax.staggerFromTo(".glasses", 1, 
        {
            bottom: -300,
            right: -1520
        }, 
        {
            bottom: -240,
            right: -1200, 
            ease: Linear.easeNone
        }, 1);
    var tween_focusbr = TweenMax.staggerFromTo(".focus-white-bottom-right", 1, 
        {
            bottom: 0,
            right: 0
        }, 
        {
            bottom: 190,
            right: 300, 
            ease: Linear.easeNone
        }, 1);
    var tween_cup = TweenMax.staggerFromTo(".cup", 1, 
        {
            bottom: -100,
            left: -1520
        }, 
        {
            bottom: -80,
            left: -1100, 
            ease: Linear.easeNone
        }, 1);
    var tween_focusbl = TweenMax.staggerFromTo(".focus-white-bottom-left", 1, 
        {
            bottom: 0,
            left: 0
        }, 
        {
            bottom: 190,
            left: 300, 
            ease: Linear.easeNone
        }, 1);

    // build scene
    var scene_camera = new ScrollMagic.Scene({triggerElement: "#trigger-main-animation", duration: 1500})
                    .setTween(tween_camera)
                    .addTo(controller);
    var scene_focustl = new ScrollMagic.Scene({triggerElement: "#trigger-main-animation", duration: 1500})
                    .setTween(tween_focustl)
                    .addTo(controller);
    var scene_phone = new ScrollMagic.Scene({triggerElement: "#trigger-main-animation", duration: 1500})
                    .setTween(tween_phone)
                    .addTo(controller);
    var scene_focustr = new ScrollMagic.Scene({triggerElement: "#trigger-main-animation", duration: 1500})
                    .setTween(tween_focustr)
                    .addTo(controller);
    var scene_glasses = new ScrollMagic.Scene({triggerElement: "#trigger-main-animation", duration: 1500})
                    .setTween(tween_glasses)
                    .addTo(controller);
    var scene_focusbr = new ScrollMagic.Scene({triggerElement: "#trigger-main-animation", duration: 1500})
                    .setTween(tween_focusbr)
                    .addTo(controller);
    var scene_cup = new ScrollMagic.Scene({triggerElement: "#trigger-main-animation", duration: 1500})
                    .setTween(tween_cup)
                    .addTo(controller);
    var scene_focusbl = new ScrollMagic.Scene({triggerElement: "#trigger-main-animation", duration: 1500})
                    .setTween(tween_focusbl)
                    .addTo(controller);

    var pin_scene = new ScrollMagic.Scene({triggerElement: "#trigger-main-animation", duration: 2000})
                    .setPin("#pin")
                    .addTo(controller);
}

if (window.innerWidth > 1000) {
    scrollAnimation();
}

function scrollVideo() {
    // define images
    var images1 = [
        "img/choco-wafer/choco-wafer-1.png",
        "img/choco-wafer/choco-wafer-2.png",
        "img/choco-wafer/choco-wafer-3.png",
        "img/choco-wafer/choco-wafer-4.png",
        "img/choco-wafer/choco-wafer-5.png",
        "img/choco-wafer/choco-wafer-6.png",
        "img/choco-wafer/choco-wafer-7.png"
    ];

    var images2 = [
        "img/choco-grain/choco-grain-1.png",
        "img/choco-grain/choco-grain-2.png",
        "img/choco-grain/choco-grain-3.png",
        "img/choco-grain/choco-grain-4.png",
        "img/choco-grain/choco-grain-5.png",
        "img/choco-grain/choco-grain-6.png",
        "img/choco-grain/choco-grain-7.png"
    ];

    // TweenMax can tween any property of any object. We use this object to cycle through the array
    var obj = {curImg: 0};

    // create tween1
    var tween1 = TweenMax.to(obj, 0.5,
        {
            curImg: images1.length - 1,
            roundProps: "curImg",
            immediateRender: true,
            ease: Linear.easeNone,
            onUpdate: function () {
                $("#choco-wafer-img").attr("src", images1[obj.curImg]);
            }
        }
    );

    // create tween2
    var tween2 = TweenMax.to(obj, 0.5,
        {
            curImg: images2.length - 1,
            roundProps: "curImg",
            immediateRender: true,
            ease: Linear.easeNone,
            onUpdate: function () {
                $("#choco-grain-img").attr("src", images2[obj.curImg]);
            }
        }
    );

    // build scene
    var scene1 = new ScrollMagic.Scene({triggerElement: "#trigger-choco-wafer", duration: 450})
                    .setTween(tween1)
                    .addTo(controller);

    var scene2 = new ScrollMagic.Scene({triggerElement: "#trigger-choco-grain", duration: 450})
                    .setTween(tween2)
                    .addTo(controller);
}

scrollVideo();