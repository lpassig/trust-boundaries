// Original vector scenery. No remote assets or network dependencies.
// All figures use their shoe soles as the origin, so placement is on the floor.
function humanFigure(role,x,y,scale=1) {
  const adult=!['alex','sibling','mia'].includes(role);
  const colors={parent:{skin:'#d8b19b',hair:'#584651',shirt:'#8c9b98',shade:'#748781',pants:'#424857',shoe:'#d6c5b6'},
   grandparent:{skin:'#d8b19b',hair:'#b8aeb3',shirt:'#779498',shade:'#5a777b',pants:'#424857',shoe:'#d6c5b6'},
   grandparentTwo:{skin:'#cba48d',hair:'#cdc2ba',shirt:'#ba9476',shade:'#997857',pants:'#424857',shoe:'#d6c5b6'},
   parentTwo:{skin:'#cba48d',hair:'#473842',shirt:'#9c8396',shade:'#806876',pants:'#424857',shoe:'#d6c5b6'},
   alex:{skin:'#dfb39d',hair:'#3e3448',shirt:'#b39ace',shade:'#937aaf',pants:'#53617e',shoe:'#e4ddec'},sibling:{skin:'#cba48d',hair:'#635049',shirt:'#8da9b1',shade:'#708e9d',pants:'#444e64',shoe:'#cbd8dc'},
   babysitter:{skin:'#a57961',hair:'#333147',shirt:'#5f9d94',shade:'#47786f',pants:'#3a434f',shoe:'#e0d1bd'},
   mia:{skin:'#dfb39d',hair:'#59405c',shirt:'#dca184',shade:'#aa6b68',pants:'#574762',shoe:'#e8d8d1'}}[role];
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
      ${adult?`<path d="M-16-151Q-21-178 0-180Q23-177 19-149L16-132L-16-134Z" fill="${colors.hair}"/>`:''}
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
