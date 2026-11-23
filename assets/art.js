// Original vector scenery. No remote assets or network dependencies.
// All figures use their shoe soles as the origin, so placement is on the floor.
function humanFigure(role,x,y,scale=1) {
  const adult=role==='parent';
  const colors={parent:{skin:'#d8b19b',hair:'#584651',shirt:'#8c9b98',shade:'#748781',pants:'#424857',shoe:'#d6c5b6'},alex:{skin:'#dfb39d',hair:'#3e3448',shirt:'#b39ace',shade:'#937aaf',pants:'#53617e',shoe:'#e4ddec'},sibling:{skin:'#cba48d',hair:'#635049',shirt:'#8da9b1',shade:'#708e9d',pants:'#444e64',shoe:'#cbd8dc'}}[role];
  return `<g class="human-figure" data-character="${role}" data-floor-x="${x}" data-floor-y="${y}" transform="translate(${x} ${y}) scale(${scale})">
    <ellipse class="contact-shadow" cx="2" cy="2" rx="29" ry="7" fill="#171728" opacity=".28"/>
    <path d="M-18-73L18-73L20-37L18-5L7-4L2-46L-3-46L-9-4L-21-5L-20-38Z" fill="${colors.pants}"/>
    <path d="M-1-68L1-47M-17-35L-12-34M8-35L17-34" stroke="#2f374c" stroke-width="1.4" opacity=".45" fill="none"/>
    <path d="M-21-7L-9-7L-4-2Q2 1-3 4L-25 3Q-28 0-21-7Z" fill="${colors.shoe}"/>
    <path d="M7-7L18-7L24-3Q33 1 28 4L6 3Z" fill="${colors.shoe}"/>
    ${adult?'':`<path d="M-22 1L-4 2M9 1L27 2M-15-4L-10-3M14-4L19-3" stroke="#a5a4b7" stroke-width="1"/>`}
    <path d="M-19-123Q-30-119-30-103L-27-78L-18-77L-18-100L-11-114Z" fill="${colors.shade}"/>
    <path d="${adult?'M18-122Q34-114 34-103L28-90L19-94L23-104L10-114Z':'M18-122Q29-118 29-101L27-76L18-77L17-100L10-113Z'}" fill="${colors.shade}"/>
    <ellipse cx="-22" cy="-74" rx="4.7" ry="6.5" fill="${colors.skin}"/>
    <ellipse cx="${adult?25:22}" cy="${adult?-89:-73}" rx="4.7" ry="6.5" transform="${adult?'rotate(24 25 -89)':''}" fill="${colors.skin}"/>
    <path d="M-18-124Q-7-131 5-129L19-123L23-76Q5-66-22-74L-21-104Z" fill="${colors.shirt}"/>
    <path d="M14-120L19-115L21-77L10-74Z" fill="${colors.shade}" opacity=".55"/>
    <path d="M-5-138L6-138L7-125Q0-118-7-126Z" fill="${colors.skin}"/>
    ${adult?`<path d="M-9-128L-1-116L8-128L10-76L-10-75Z" fill="#e7dccb"/><path d="M-9-128L-3-116L-11-106M8-128L2-116L10-106" fill="none" stroke="#647a75" stroke-width="1.6"/><circle cx="-2" cy="-101" r="1.5" fill="#8c837b"/><circle cx="-2" cy="-89" r="1.5" fill="#8c837b"/>`:`<path d="M-11-127Q0-117 10-127L13-119Q0-110-13-119Z" fill="${colors.shade}"/><path d="M-7-117L-8-100M7-117L8-100" stroke="#e2d6eb" stroke-width="1.4"/><path d="M-13-91Q0-96 13-89L14-80L-14-80Z" fill="${colors.shade}" opacity=".75"/>`}
    <g class="character-head">
      ${adult?'<path d="M-16-151Q-21-178 0-180Q23-177 19-149L16-132L-16-134Z" fill="#584651"/>':''}
      <ellipse cx="-13" cy="-151" rx="3.8" ry="5.4" fill="${colors.skin}"/><ellipse cx="14" cy="-151" rx="3.5" ry="5.2" fill="${colors.skin}"/>
      <path d="M-13-158Q-13-173 1-173Q17-172 15-156L14-145Q10-133 1-133Q-9-134-12-145Z" fill="${colors.skin}"/>
      <path d="${adult?'M-15-153Q-20-176-2-179Q17-183 18-160L12-153L9-168Q-1-157-14-159Z':'M-15-152L-18-164L-13-164Q-13-178-3-176Q7-186 13-176Q24-172 18-157L12-152L9-164Q0-156-10-160L-12-151Z'}" fill="${colors.hair}"/>
      <path d="M-8-152L-4-153M5-153L9-152" stroke="#69515b" stroke-width="1.3" stroke-linecap="round"/>
      <circle cx="-5" cy="-149" r="1.2" fill="#3e3546"/><circle cx="7" cy="-149" r="1.2" fill="#3e3546"/>
      <path d="M2-148L4-143L1-142M-3-139Q1-136 6-140" fill="none" stroke="#a27373" stroke-width="1.1" stroke-linecap="round"/>
      ${adult?'<g fill="none" stroke="#6c646d" stroke-width="1"><rect x="-10" y="-152" width="9" height="7" rx="2.5"/><rect x="3" y="-152" width="9" height="7" rx="2.5"/><path d="M-1-150L3-150"/></g>':''}
    </g>
  </g>`;
}
const commonDefs=`<defs><linearGradient id="floor" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#71607e"/><stop offset="1" stop-color="#332f4a"/></linearGradient><linearGradient id="wall" x1="0" x2="1" y2="1"><stop stop-color="#57506e"/><stop offset="1" stop-color="#36364f"/></linearGradient><linearGradient id="window" x2="0" y2="1"><stop stop-color="#c5b0dd"/><stop offset=".55" stop-color="#8d86b1"/><stop offset="1" stop-color="#67728d"/></linearGradient><linearGradient id="light" x2="0" y2="1"><stop stop-color="#e9c795" stop-opacity=".18"/><stop offset="1" stop-color="#e9c795" stop-opacity="0"/></linearGradient><linearGradient id="screen" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#8d8fb4"/><stop offset="1" stop-color="#b7a6c4"/></linearGradient><linearGradient id="agentwall" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#345563"/><stop offset="1" stop-color="#243744"/></linearGradient><linearGradient id="agentfloor" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#3c5a64"/><stop offset="1" stop-color="#1f343f"/></linearGradient><radialGradient id="glow"><stop stop-color="#9dded1" stop-opacity=".26"/><stop offset="1" stop-color="#9dded1" stop-opacity="0"/></radialGradient></defs>`;
function roomArt(mode,act=0,state={}) {
  // The foundation never changes location or geometry between acts.
  return `<svg viewBox="0 0 1000 580" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">${commonDefs}<g class="room-foundation" data-location="${mode==='teen'?'alex-home':'nova-workspace'}">${mode==='teen'?teenRoom():agentRoom()}</g>${roomStateOverlay(mode,act,state)}</svg>`;
}
function teenRoom(){return `
<ellipse cx="515" cy="509" rx="388" ry="49" fill="#111321" opacity=".35"/>
<path d="M117 158L495 58L893 193L515 325Z" fill="#3d354f"/><path d="M117 158L495 58L495 303L117 421Z" fill="url(#wall)"/><path d="M495 58L893 193L893 424L495 303Z" fill="#61506c"/>
<path d="M117 421L495 303L893 424L515 553Z" fill="url(#floor)"/>
<g stroke="#9b8295" stroke-width="1" opacity=".2"><path d="M165 437L545 319M213 454L594 333M262 470L644 349M310 486L692 364M359 502L741 380M409 519L792 396M458 535L842 411"/><path d="M214 390L610 521M307 362L704 489M399 333L798 457"/></g>
<path d="M118 407L495 290L893 411L893 425L495 307L118 423Z" fill="#302b42"/>
<!-- window and dusk skyline -->
<path d="M178 161L352 114L352 266L178 321Z" fill="#292e46"/><path d="M188 169L343 127L343 258L188 307Z" fill="url(#window)"/>
<path d="M191 256L210 250L210 223L231 217L231 242L248 236L248 196L271 190L271 232L291 226L291 209L310 204L310 226L340 216L340 257L191 302Z" fill="#555c7f" opacity=".7"/>
<circle cx="309" cy="165" r="16" fill="#efc7b0" opacity=".8"/><path d="M265 148L265 283M186 240L345 193" stroke="#45415d" stroke-width="7"/>
<path d="M166 151L188 146L188 315L167 327Z" fill="#9b7e9d"/><path d="M345 106L367 100L369 269L348 277Z" fill="#8a7094"/>
<path d="M188 308L343 258L673 425L503 480Z" fill="url(#light)"/>
<!-- shelves -->
<path d="M545 138L679 181L679 192L545 149Z" fill="#b392aa"/><path d="M557 118L568 121L568 143L557 140Z" fill="#b0a0c0"/><path d="M572 113L582 116L582 147L572 144Z" fill="#78899c"/><path d="M585 123L595 126L595 152L585 149Z" fill="#c19793"/><path d="M600 122L609 125L609 157L600 154Z" fill="#6f6a8d"/>
<path d="M636 142L656 149L652 171L640 167Z" fill="#c4a190"/><path d="M646 145Q620 137 630 121Q643 121 646 145M648 145Q644 116 663 122Q671 136 648 145" fill="#839c8b"/>
<!-- wall poster -->
<path d="M760 172L844 200L844 284L760 257Z" fill="#c7b6b9"/><path d="M767 181L837 205L837 273L767 251Z" fill="#5e6383"/><path d="M772 243L791 213L805 239L817 226L834 268Z" fill="#9b91a9"/><circle cx="819" cy="219" r="7" fill="#d3b0a3"/>
<!-- bulletin board and note -->
<path d="M421 132L478 116L478 205L421 221Z" fill="#302c45"/><path d="M427 136L472 124L472 200L427 213Z" fill="#997c8f"/><path d="M436 153L464 146L462 185L435 194Z" fill="#e0c9b6"/><circle cx="449" cy="150" r="2.4" fill="#77608d"/><path d="M440 165L458 160M440 171L459 166M440 178L452 174" stroke="#ad8d91" stroke-width="2"/>
<!-- bed -->
<path d="M153 335L314 287L434 345L273 399Z" fill="#a485a0"/><path d="M153 335L273 385L273 420L153 373Z" fill="#6d607d"/><path d="M273 385L434 333L434 370L273 421Z" fill="#574e6d"/><path d="M159 329L313 282L431 331L277 381Z" fill="#b5a1bc"/><path d="M190 328L233 313L272 329L229 345Z" fill="#dac7d6"/><path d="M262 303L314 286L426 332L375 349Z" fill="#857194"/><path d="M169 369L169 390M421 370L421 386" stroke="#292940" stroke-width="7"/>
<!-- rug -->
<path d="M334 408L524 346L713 413L520 478Z" fill="#8d6e96"/><path d="M349 409L524 354L697 414L519 469Z" fill="none" stroke="#b595b0" stroke-width="2" opacity=".5"/><path d="M439 379L610 444M389 396L561 461" stroke="#a185a4" stroke-width="2" opacity=".5"/>
<!-- desk legs and top -->
<path d="M627 307L627 398M813 367L813 452M731 339L731 426" stroke="#342c45" stroke-width="9"/><path d="M591 298L721 256L857 304L724 351Z" fill="#b89ba9"/><path d="M591 298L724 342L857 299L857 311L724 356L591 311Z" fill="#82697e"/>
<!-- laptop -->
<path d="M677 279L679 215L755 241L755 305Z" fill="#2d2d45"/><path d="M684 224L748 246L748 293L683 272Z" fill="url(#screen)"/><path d="M691 237L736 252M691 245L723 256M692 254L735 268" stroke="#eee2ea" stroke-width="3" opacity=".6"/>
<path d="M676 280L755 306L720 320L642 292Z" fill="#807b9a"/><path d="M673 285L739 306L719 313L655 292Z" fill="#3f405a"/><path d="M680 298L700 305L691 309L671 302Z" fill="#a8a1ba"/>
<!-- desk lamp -->
<path d="M811 300L811 262L793 231" stroke="#303246" stroke-width="5" fill="none"/><ellipse cx="811" cy="302" rx="14" ry="5" fill="#444258"/><path d="M781 219Q797 215 807 232L783 245L773 231Z" fill="#e4bd93"/><path d="M781 242L760 290L833 313L799 231Z" fill="url(#light)"/>
<!-- books and mug -->
<path d="M771 314L799 304L821 312L793 323Z" fill="#c1acbd"/><path d="M771 318L792 327L821 317L821 311L793 321L771 313Z" fill="#928099"/><path d="M628 288L640 291L640 307L628 303Z" fill="#cfacb6"/>
<!-- desk chair -->
<path d="M737 362L762 353L787 364L761 374Z" fill="#9d829f"/><path d="M740 367L740 403M780 368L780 414" stroke="#3b314d" stroke-width="5"/><path d="M746 351L746 320Q765 310 786 325L786 363Z" fill="#735c81"/>
<!-- low table -->
<path d="M418 419L520 384L605 415L501 452Z" fill="#b08e9e"/><path d="M418 419L501 447L605 412L605 423L501 459L418 431Z" fill="#775e79"/><path d="M430 432L430 464M590 426L590 460M501 456L501 489" stroke="#393048" stroke-width="7"/>
<!-- phone and notes -->
<path d="M509 404L531 397L548 404L526 412Z" fill="#262b41" stroke="#c4a8d7" stroke-width="2"/><path d="M514 404L530 400L542 404L526 409Z" fill="#b09ac7"/>
<path d="M446 423L472 413L497 422L470 433Z" fill="#ddc3b4"/><path d="M452 424L472 417M459 427L478 421" stroke="#a3899f" stroke-width="1.5"/>
<!-- side cabinet rests on the floor beside the desk -->
<g transform="translate(-33 -35)">
<path d="M831 415L864 404L889 414L857 425Z" fill="#a890a8"/><path d="M831 415L857 425L857 469L831 460Z" fill="#6a5c77"/><path d="M857 425L889 414L889 457L857 469Z" fill="#524d68"/>
<path d="M850 389L874 396L869 420L855 416Z" fill="#bd98a0"/><path d="M860 397Q827 385 837 363Q858 365 860 397M862 392Q869 358 887 366Q893 388 862 397M860 383Q848 346 867 346Q880 363 860 383" fill="#83a294"/>
</g>
${humanFigure('parent',298,451,1.06)}${humanFigure('alex',636,480,1)}
<!-- backpack -->
<path d="M363 412Q347 382 366 370Q385 362 398 387L403 425Q379 441 359 425Z" fill="#666984"/><path d="M366 406Q379 396 394 408L395 424Q379 434 365 423Z" fill="#7f7d99" stroke="#a79cb3" stroke-width="1"/>
<g fill="#d4b4e5" opacity=".5"><circle cx="399" cy="133" r="1.5"/><circle cx="713" cy="201" r="1"/><circle cx="592" cy="238" r="1.2"/><circle cx="351" cy="371" r="1.5"/></g>`;}
function agentRoom(){return `
<ellipse cx="515" cy="509" rx="388" ry="49" fill="#0b1720" opacity=".5"/><path d="M117 158L495 58L893 193L515 325Z" fill="#263d49"/><path d="M117 158L495 58L495 303L117 421Z" fill="url(#agentwall)"/><path d="M495 58L893 193L893 424L495 303Z" fill="#2e4856"/><path d="M117 421L495 303L893 424L515 553Z" fill="url(#agentfloor)"/>
<g stroke="#6ea1a4" stroke-width="1" opacity=".18"><path d="M165 437L545 319M213 454L594 333M262 470L644 349M310 486L692 364M359 502L741 380M409 519L792 396M458 535L842 411"/><path d="M214 390L610 521M307 362L704 489M399 333L798 457"/></g><path d="M118 408L495 290L893 411" fill="none" stroke="#77b6b0" stroke-width="3" opacity=".65"/>
<!-- mission authority panel -->
<path d="M167 170L338 124L338 300L167 354Z" fill="#1a2e3e" stroke="#5d8a99" stroke-width="2"/><path d="M179 184L325 144L325 283L179 328Z" fill="#284554"/>
<path d="M218 195L282 177L282 237L249 269L218 255Z" fill="#3a6d76" stroke="#91d9c9" stroke-width="2"/><path d="M236 222L247 229L268 203" fill="none" stroke="#b2eee0" stroke-width="4"/>
<path d="M195 285L303 252M207 298L292 272" stroke="#6a9aa1" stroke-width="4"/><g fill="#9cddce"><circle cx="189" cy="194" r="3"/><circle cx="310" cy="159" r="3"/></g>
<!-- untrusted document hologram -->
<path d="M414 129L479 111L479 219L414 239Z" fill="#102b3b" stroke="#6f9b9f" stroke-width="2"/><path d="M427 147L466 136L466 199L427 211Z" fill="#99c6c3" opacity=".6"/><path d="M435 161L458 154M435 172L455 166M435 183L460 175" stroke="#274b5b" stroke-width="3"/>
<!-- wall service map -->
<path d="M547 120L847 222L847 300L547 199Z" fill="#1c3341" stroke="#547988" stroke-width="2"/><g fill="none" stroke="#58959c" stroke-width="2"><path d="M576 161L634 180L676 165L734 185L734 219L812 245"/><path d="M634 180L634 207L680 221"/></g><g fill="#8ec9c4"><circle cx="576" cy="161" r="5"/><circle cx="676" cy="165" r="5"/><circle cx="734" cy="219" r="5"/><circle cx="812" cy="245" r="5"/></g><g fill="#486d79" stroke="#83b8b8"><path d="M617 166L649 177L649 195L617 184Z"/><path d="M665 205L695 215L695 234L665 224Z"/></g>
<!-- server racks -->
<path d="M149 363L198 349L232 365L183 381Z" fill="#59838b"/><path d="M149 363L183 378L183 453L149 438Z" fill="#243e4d"/><path d="M183 378L232 362L232 437L183 453Z" fill="#1e3343"/>
<g stroke="#81aaa8" stroke-width="4"><path d="M191 390L223 380M191 407L223 397M191 424L223 414"/></g><g fill="#a1d6be"><circle cx="215" cy="381" r="2"/><circle cx="215" cy="398" r="2"/><circle cx="215" cy="415" r="2"/></g>
<!-- protected floor -->
<path d="M333 391L529 329L701 391L505 457Z" fill="#356473" opacity=".4" stroke="#84c8c2" stroke-width="2" stroke-dasharray="7 6"/><ellipse cx="515" cy="370" rx="140" ry="100" fill="url(#glow)"/>
<!-- crm terminal -->
<path d="M633 309L633 404M807 367L807 453M735 341L735 427" stroke="#172c3c" stroke-width="9"/><path d="M590 298L722 257L858 303L724 351Z" fill="#567d88"/><path d="M590 298L724 342L858 299L858 311L724 356L590 311Z" fill="#345364"/>
<path d="M654 272L655 196L770 235L770 311Z" fill="#152d3b" stroke="#7bb2b7" stroke-width="2"/><path d="M663 210L760 242L760 294L663 262Z" fill="#2c5665"/>
<path d="M674 227L720 242M674 237L744 260M674 248L724 265" stroke="#a7d5c9" stroke-width="3"/><path d="M736 252L750 257L750 283L736 278Z" fill="#69a89e"/>
<path d="M653 274L770 312L723 328L606 289Z" fill="#73949c"/><path d="M645 281L747 314L722 321L622 289Z" fill="#314f60"/>
<!-- runtime console -->
<path d="M435 404L529 373L609 401L514 434Z" fill="#6d929c"/><path d="M435 404L514 430L609 398L609 445L514 477L435 451Z" fill="#294a5a"/><path d="M514 430L609 398L609 445L514 477Z" fill="#1e3b4b"/>
<path d="M476 400L529 384L568 397L515 415Z" fill="#214c5d" stroke="#7dc3bc" stroke-width="1.5"/><path d="M487 400L530 388L555 396L513 410Z" fill="#77b6af" opacity=".4"/><path d="M446 424L495 441M446 436L480 448" stroke="#5f8e9b" stroke-width="4"/><circle cx="582" cy="430" r="3" fill="#a9e7d1"/>
<!-- memory stack -->
<path d="M299 427L349 410L399 429L347 446Z" fill="#759f9f"/><path d="M299 427L347 443L399 426L399 468L347 486L299 468Z" fill="#254657"/><path d="M347 443L399 426L399 468L347 486Z" fill="#1f3c4c"/>
<path d="M306 438L338 449M306 451L338 462M356 451L388 440M356 464L388 453M356 476L388 465" stroke="#609b9f" stroke-width="3"/>
<!-- Nova bot -->
<ellipse cx="516" cy="356" rx="43" ry="13" fill="#182d3e"/><path d="M488 301L487 338L501 347L510 320L521 347L538 339L538 301Z" fill="#426d7c"/><path d="M480 242Q514 226 546 245L541 309Q514 326 483 307Z" fill="#78aaa9" stroke="#a2cdc4" stroke-width="1.5"/><path d="M479 250L459 278L468 292L490 267M545 250L567 268L558 283L536 268" fill="#527f8a" stroke="#92b6b7" stroke-width="2"/>
<path d="M492 193Q517 183 541 199L543 230Q518 248 490 231Z" fill="#9bc6bf"/><path d="M495 203Q516 195 536 208L536 224Q516 235 495 223Z" fill="#1a3c4e"/><g class="nova-expression" data-expression="friendly"><ellipse cx="505" cy="214" rx="2.8" ry="3.5" fill="#b5f0dd"/><ellipse cx="524" cy="218" rx="2.8" ry="3.5" fill="#b5f0dd"/><path d="M504 222Q514 231 527 226" stroke="#b5f0dd" stroke-width="2.2" stroke-linecap="round" fill="none"/></g><path d="M513 196L513 181" stroke="#7fb9b4" stroke-width="3"/><circle cx="513" cy="179" r="4" fill="#b4eddb"/><path d="M502 271L524 278L524 292L502 286Z" fill="#284d5d"/><path d="M507 279L519 282" stroke="#a1d9ca" stroke-width="3"/>
<!-- Pip remains visible throughout the mission; controls sit beside this figure. -->
<g class="helper-bot" data-character="pip" data-face-x="839" data-face-y="385">
<ellipse cx="839" cy="439" rx="28" ry="10" fill="#122b38"/><path d="M816 395L819 427L837 438L858 428L863 397Z" fill="#557b8f" stroke="#94b8c4"/><path d="M816 371Q840 358 863 376L862 397Q839 412 817 396Z" fill="#9ab0c6"/><path d="M822 380L856 386L856 395L822 390Z" fill="#293f59"/><circle cx="832" cy="385" r="2" fill="#d5c7f5"/><circle cx="847" cy="388" r="2" fill="#d5c7f5"/>
</g>
<!-- connection lines -->
<g stroke="#8cc9bd" stroke-width="1.5" fill="none" opacity=".55" stroke-dasharray="4 5"><path d="M258 327L370 359L471 326"/><path d="M558 329L640 355L680 334"/><path d="M401 454L439 442"/><path d="M609 436L692 464L801 433"/></g>
<g fill="#b6e6d6" opacity=".5"><circle cx="381" cy="201" r="1.5"/><circle cx="672" cy="184" r="1"/><circle cx="591" cy="236" r="1.2"/><circle cx="276" cy="372" r="1.5"/></g>`;}

// Notifications, access indicators, and people change within the same room.
function roomStateOverlay(mode,act,state) {
  const teen=mode==='teen',step=state.step??act*3;
  const tone=state.revoked||state.paused?'#e6b09e':'#a5ddc8';
  let art='';
  if((state.hasIncoming??(step>=3))&&!state.verified&&!state.revoked) {
    art+=teen?`<g class="incoming-signal" data-event="phone-message"><ellipse cx="526" cy="404" rx="33" ry="13" fill="#e7bf8b" opacity=".22"/><rect x="504" y="365" width="45" height="29" rx="5" fill="#dcb68e" stroke="#f4dcad" stroke-width="2"/><path d="M508 370L526 381L545 370" fill="none" stroke="#6c5266" stroke-width="2"/><path d="M526 394L526 401" stroke="#e6c995" stroke-width="2"/></g>`:`<g class="incoming-signal" data-event="retrieved-document"><path d="M419 134L474 119L474 214L419 231Z" fill="none" stroke="#e7bd87" stroke-width="3"/><path d="M450 187L463 210L438 217Z" fill="#dfb784"/><path d="M451 196L451 203M451 207L451 209" stroke="#614d54" stroke-width="2"/></g>`;
  }
  if(state.verified)art+=teen?`<g data-event="message-verified"><circle cx="544" cy="392" r="10" fill="#476e65" stroke="#b1ddc8"/><path d="M539 392L543 396L550 386" stroke="#c5edd7" stroke-width="2" fill="none"/></g>`:`<g data-event="document-verified"><circle cx="464" cy="205" r="10" fill="#396a61" stroke="#a7dec8"/><path d="M459 205L463 209L470 199" stroke="#c5edd7" stroke-width="2" fill="none"/></g>`;
  if(state.hasSourceCredit&&!state.revoked&&!state.paused)art+=teen
    ?'<path data-event="source-credit" d="M691 264L737 279" stroke="#a5ddc8" stroke-width="4" stroke-linecap="round"/>'
    :'<path data-event="source-credit" d="M676 250L743 271" stroke="#a5ddc8" stroke-width="4" stroke-linecap="round"/>';
  if(state.signInRequired)art+='<g data-event="sign-in-screen"><path d="M684 224L748 246L748 293L683 272Z" fill="#182634"/><path d="M694 232L736 246L736 259L694 245Z" fill="#a5ddc8"/><path d="M694 253L736 267L736 274L694 260Z" fill="#5a6d7c"/></g>';
  if(state.delivered)art+=`<g data-event="file-delivered"><circle cx="754" cy="282" r="11" fill="#426e65" stroke="#b2e2ce"/><path d="M748 282L753 286L760 276" stroke="#c5edd7" stroke-width="2" fill="none"/></g>`;
  if(state.hasNote)art+=`<g data-event="sourced-note"><circle cx="${teen?484:381}" cy="${teen?425:445}" r="8" fill="#a3d9bd"/><path d="M${teen?'480 425L483 428L489 421':'377 445L380 448L386 441'}" stroke="#345c53" stroke-width="1.5" fill="none"/></g>`;
  if((state.helperVisible??(step>=7))&&teen)art+=`<g data-event="sibling-in-room">${humanFigure('sibling',747,463,.89)}</g>`;
  if(state.revoked||state.paused) {
    if(!state.serviceStillOpen&&!state.signInRequired)art+=`<g data-event="access-locked"><path d="${teen?'M684 224L748 246L748 293L683 272Z':'M663 210L760 242L760 294L663 262Z'}" fill="#20283f" opacity=".88"/><g transform="translate(${teen?'715 260':'714 254'})"><path d="M-7 0L-7-8Q0-18 7-8L7 0" fill="none" stroke="${tone}" stroke-width="3"/><rect x="-11" y="-1" width="22" height="17" rx="3" fill="${tone}"/><path d="M0 4L0 10" stroke="#343149" stroke-width="2"/></g></g>`;
    if(state.serviceStillOpen)art+=`<g data-event="service-still-open"><circle cx="${teen?715:714}" cy="${teen?260:254}" r="19" fill="none" stroke="#efd0a0" stroke-width="3" stroke-dasharray="4 3"/></g>`;
    art+=teen?`<path d="M509 404L531 397L548 404L526 412Z" fill="#2b2c42" stroke="${tone}" stroke-width="2"/>`:`<path d="M476 400L529 384L568 397L515 415Z" fill="#302f43" stroke="${tone}" stroke-width="2"/>`;
  }
  return `<g class="room-events" data-act="${act+1}">${art}</g>`;
}

// Matching symbols connect scene targets to their named controls in both editions.
function sceneObjectGlyph(key,mode) {
  const shapes={
    person:'<circle cx="12" cy="7" r="3"/><path d="M5 21v-3a7 7 0 0 1 14 0v3"/>',
    shield:'<path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6Z"/><path d="m8 12 3 3 5-6"/>',
    phone:'<rect x="6" y="2" width="12" height="20" rx="3"/><path d="M10 18h4"/>',
    console:'<rect x="3" y="4" width="18" height="16" rx="2"/><path d="m7 9 3 3-3 3m6 0h4"/>',
    laptop:'<path d="M5 17V5h14v12M2 17h20l-2 3H4Z"/><path d="M9 9h6m-6 4h4"/>',
    brief:'<path d="M5 3h10l4 4v14H5ZM14 3v5h5M8 12h8m-8 4h6"/>',
    notebook:'<rect x="5" y="3" width="15" height="18" rx="2"/><path d="M9 3v18M3 7h4m-4 5h4m-4 5h4m5-9h5m-5 4h5"/>',
    memory:'<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 4 16 4 16 0V5M4 12c0 4 16 4 16 0"/>',
    helper:'<circle cx="9" cy="7" r="3"/><path d="M3 21v-3a6 6 0 0 1 12 0v3m3-16v6m-3-3h6"/>'
  };
  const kind=key==='parent'?(mode==='agent'?'shield':'person'):key==='phone'?(mode==='agent'?'console':'phone'):['note','brief'].includes(key)?'brief':['memory','notebook'].includes(key)?(mode==='agent'?'memory':'notebook'):['sibling','helper'].includes(key)?'helper':key;
  return shapes[kind]||shapes.brief;
}
function sceneObjectIcon(key,mode) {
  return `<svg class="object-icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${sceneObjectGlyph(key,mode)}</svg>`;
}
