var csw_images = new Array('40480.gif','40481.gif','40484.gif');
var csw_images2 = new Array();

var csw_amount = 3;
var csw_interval = 3*15;
var csw_afterimage = 'no';
var csw_blinking = 'no';
var csw_spreading = 'yes';
var csw_design = 1;
var csw_base = "http://master-akadem.ru/public_test_comp/scripts/14/images/";
var csw_debug = 0;

var csw_off = 0;
var csw_deleted = 0;
var csw_flakes = new Array();
var csw_flakes_id = new Array();
var csw_timers = new Array();
var csw_blink = new Array();
var csw_started = 0;
var csw_ltp = (document.layers) ? true:false;
var csw_docall = (document.all) ? true:false;
var csw_ns6=document.getElementById&&!document.all;
var csw_no = csw_amount*csw_images.length;
var csw_cur_no = 0;
var cur_flake = 0;
var csw_img_max = csw_images.length;
var directionCursor  = -1; // 1 - left , 2 - right
var pos = -1; // Размер сдвига
var csw_step = 0;
var csw_img = 0;

function csw_switch_on()
{
	//document.getElementById('csw_switch_off').style.display = "none";	
	//document.getElementById('csw_switch_on').style.display = "block";
}

function csw_switch_off()
{
	//document.getElementById('csw_switch_on').style.display = "none";	
	//document.getElementById('csw_switch_off').style.display = "block";
}

function csw_add_onload_event(fnc)
{
  if ( typeof window.addEventListener != "undefined" )
    window.addEventListener( "load", fnc, false );
  else if ( typeof window.attachEvent != "undefined" ) {
    window.attachEvent( "onload", fnc );
  }
  else {
    if ( window.onload != null ) {
      var oldOnload = window.onload;
      window.onload = function ( e ) {
        oldOnload( e );
        window[fnc]();
      };
    }
    else
      window.onload = fnc;
  }
}

function csw_start(sw)
{
	if(csw_deleted == 1) return;

	var i = 0;

	if(csw_started == 1)
	{
		if(sw == 1) csw_switch_off();
		csw_started = 0;
		
		if(csw_debug == 1)
		{
			for(i in csw_flakes)
			{
				parent.document.body.removeChild(csw_flakes[i]);
				delete csw_flakes[i];
			}
		}
		else
		{
			for(i in csw_flakes)
			{
				document.body.removeChild(csw_flakes[i]);
				delete csw_flakes[i];
			}
		}
		
		return;
	}

	csw_started = 1;
	if(sw == 1) csw_switch_on();

	csw_animate();	
}

var posX, posY, lastX, lastY;
lastX = 0;
lastY = 0;

function csw_track_pos(e)
{
	if(e)
	{
		if(csw_debug == 1)
		{
			//posX = (parseInt(e.clientX+10) + parseInt(parent.document.documentElement.scrollLeft));
			//posY = (parseInt(e.clientY) + parseInt(parent.document.documentElement.scrollTop));
			posX = parent.pageXOffset+e.clientX;
			posY = parent.pageYOffset+e.clientY;
		}
		else
		{
			posX = parseInt(e.pageX+10);
			posY = parseInt(e.pageY);
		}
						// Точка отсчета
		if(pos == -1) {
			// Первоначальное местоположение в пространстве курсора по оси X
			pos  = posX;
		} else {
			
			// Движение вправо
			if(posX < pos) {
				console.info('Влево');
				directionCursor  = 1;
			} else // Движение влево  
			if(posX > pos) {
				directionCursor = 2;
				console.info('Вправо');
			}
			
			pos = posX;
			
		}
	} 
	else
	{

		if(csw_debug == 1)
		{
			posX = (parseInt(event.clientX+10) + parseInt(parent.document.documentElement.scrollLeft));
			posY = (parseInt(event.clientY) + parseInt(parent.document.documentElement.scrollTop));
		}
		else
		{
			posX = (parseInt(event.clientX+10) + parseInt(document.documentElement.scrollLeft));
			posY = (parseInt(event.clientY) + parseInt(document.documentElement.scrollTop));
		}

	 }

	if (posX>(lastX+csw_interval)||posX<(lastX-csw_interval)||posY>(lastY+csw_interval)||posY<(lastY-csw_interval))
	{
		csw_place_flake(posX,posY);
		lastX = posX;
		lastY = posY;
	}
}

function csw_place_flake(x, y)
{
	if(csw_started == 0)
		return;

	if(csw_debug == 1)
 		var new_x = csw_ns6? Math.min(x,parent.window.innerWidth-75) : csw_docall? Math.min(x,parent.document.body.clientWidth-55) : x;
	else
 		var new_x = csw_ns6? Math.min(x,window.innerWidth-75) : csw_docall? Math.min(x,document.body.clientWidth-55) : x;

		csw_cur_no++;
		csw_step++;

		if(csw_debug == 1)
		{
			if(csw_flakes[csw_step-csw_no] != undefined)
			{
				parent.document.body.removeChild(csw_flakes[csw_step-csw_no]);
				delete csw_flakes[csw_step-csw_no];
			}

			var flake = parent.document.createElement('img');
		}
		else
		{
			if(csw_flakes[csw_step-csw_no] != undefined)
			{
				document.body.removeChild(csw_flakes[csw_step-csw_no]);
				delete csw_flakes[csw_step-csw_no];
			}

			var flake = document.createElement('img');
		}

		flake.setAttribute('id', "csw_flake" + csw_step);
		// Направление движения курсора 
		if(directionCursor == 1) {
			flake.setAttribute('src', csw_base + csw_images[csw_img]);
		} else if(directionCursor == 2) {
			if(csw_images2.length > 0)
				flake.setAttribute('src', csw_base + csw_images2[csw_img]);
			else 
				flake.setAttribute('src', csw_base + csw_images[csw_img]);
		}
		if(csw_debug == 1)
			parent.flake_append(flake);
		else
			document.body.appendChild(flake);
			
		flake.style.position = "absolute";
		flake.style.zIndex = 1000 + csw_step;
		flake.style.top = y+"px";
		flake.style.left = new_x+"px";
		csw_flakes[csw_step] = flake;
		//csw_flakes_id[csw_step] = "csw_flake" + csw_step;

		if(csw_img == csw_img_max-1)
			csw_img = 0;
		else
			csw_img++;

		if(csw_blinking == 'yes')
		{
			csw_blink[csw_step] = true;
			setTimeout("csw_f_blinking("+csw_step+")", 100);
		}

		if(csw_spreading == 'yes')
			csw_f_spreading(csw_step, y);
		if(csw_afterimage == 'yes')
			eval('t'+cur_flake+' = setTimeout("csw_fade_flake('+csw_step+')", 600);');
		else
			eval('t'+csw_step+' = setTimeout("csw_unplace_flake('+csw_step+')", 2000);');
}

function csw_f_spreading(step, y)
{
	if(csw_started == 0) return;

	if(csw_flakes[step] != undefined)
	{
		for (i = 0; i <= 1; i += 0.01) {
			setTimeout("csw_spread("+step+", " + (1 - i) +", "+(y+100)+")", i * 1000);
		}

		setTimeout("csw_unplace_flake("+step+")", 1000);
	}
}

function csw_spread(step, opa, y)
{
	if(csw_flakes[step] != undefined)
	{
		var element = csw_flakes[step];

		element.style.top = (y-(opa*100))+"px";

		element.style.opacity = opa;
		element.style.MozOpacity = opa;
		element.style.KhtmlOpacity = opa;
		element.style.filter = 'alpha(opacity=' + (opa * 100) + ');';
	}
}

function csw_f_blinking(step)
{
	if(csw_started == 0) return;

	if(csw_flakes[step] != undefined)
	{
		if(csw_blink[step] == false)
		{
			csw_opa(step, 0.5);
			csw_blink[step] = true;
		}
		else
		{
			csw_opa(step, 1);
			csw_blink[step] = false;
		}

		setTimeout("csw_f_blinking("+step+")", 100);
	}
}

function csw_opa(step, opa)
{
	if(csw_flakes[step] != undefined)
	{
		var element = csw_flakes[step];

		element.style.opacity = opa;
		element.style.MozOpacity = opa;
		element.style.KhtmlOpacity = opa;
		element.style.filter = 'alpha(opacity=' + (opa * 100) + ');';
	}
}

function csw_fade_flake(step)
{
	if(csw_started == 0) return;

	if(csw_flakes[step] != undefined)
	{
		for (i = 0; i <= 1; i += 0.01) {
			setTimeout("csw_opa("+step+", " + (1 - i) +")", i * 1000);
		}

		setTimeout("csw_unplace_flake("+step+")", 1000);
	}
}

function csw_unplace_flake(step)
{
		if(csw_started == 0) return;

		if(csw_debug == 1)
		{
			if(csw_flakes[step] != undefined)
			{
				parent.document.body.removeChild(csw_flakes[step]);
				delete csw_flakes[step];
			}
		}
		else
		{
			if(csw_flakes[step] != undefined)
			{
				document.body.removeChild(csw_flakes[step]);
				delete csw_flakes[step];
			}
		}
}

function csw_animate() 
{
	if(csw_started == 0)
		return;

	if(csw_debug == 1)
	{
		if (csw_ltp) {
			parent.document.captureEvents(Event.MOUSEMOVE);
			parent.document.onMouseMove = csw_track_pos;
		} else {
			parent.document.onmousemove = csw_track_pos;
		}
	}
	else
	{
		if (csw_ltp) {
			document.captureEvents(Event.MOUSEMOVE);
			document.onMouseMove = csw_track_pos;
		} else {
			document.onmousemove = csw_track_pos;
		}
	}
}
function f_start() { 
	if(csw_started == 0) 
	{ 
		csw_start(1);
	}
}
f_start() ;