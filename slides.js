
const OUTLINE = [

  // Opening: no LEVEL title card, just the hook and the thesis.
  {
    part: 0,
    card: false,
    moments: [
      {
        type:'title',
        title:'WHY GETTING<br>INVOLVED MATTERS',
        subtitle:'( MORE THAN YOU THINK )',
        meta:'TECH2GETHER &middot; SEPT 23, 2026 &middot; RUN TIME ~30&ndash;45 MIN',
        byline:'A TALK BY SHANNA GRAVES',
      },
      {
        type:'hook', kicker:'QUEST GIVER APPROACHES',
        title:'Who’s Involved Right Now?',
        body:'Who’s involved in a club or org right now, or are you here for the bonus points?',
        choiceA:'🎮 I’m already in the guild',
        responseA:'Good. You’ll see exactly why that pays off.',
        choiceB:'📋 ...bonus points, ngl',
        responseB:'Fair. Stay anyway: here’s why involvement ends up mattering more than the extra credit.',
      },
      {
        type:'statement', kicker:'THE THESIS',
        title:'The Frame',
        statement:'Involvement isn’t a resume line. It’s how you actually build the skills, the network, and the confidence that get you where you want to go.',
        note:'Frame the thesis before diving into the four campaigns.',
      },
    ]
  },

  // Part 1: Tech2Gether
  {
    part: 1,
    name:'TECH2GETHER', tag:'WHERE IT STARTED', duration:'~6&ndash;8 MIN',
    moments: [
      {
        kicker:'ORIGIN STORY',
        title:'Baby’s First Club',
        bullets:[
          'Took over Tech2Gether with guidance from our faculty advisor, Jackson Lewis-Hite.',
          'It was my “baby’s first club” experience. I had no clue what I was doing at first.'
        ],
      },
      {
        kicker:'THE GRIND', title:'No Party, No Guide',
        bullets:[
          'Had a hard time pulling student leadership together.',
          'Barely kept it going, doing most of the work myself, alongside Jackson.',
          'Later, Mina helped with the website, even though she wasn’t an officer at the time.'
        ],
        boosts:[{key:'RES',amount:1}],
      },
      {
        kicker:'XP GAINED', title:'What That Taught Me',
        bullets:[
          'Learned as I went, because I’d never done anything like it before.',
          'Leaned on Jackson’s guidance while still being the one accountable for making it work.',
          'Showing up consistently was most of the job, even when I had no idea what I was doing.'
        ],
        boosts:[{key:'LEAD',amount:1}],
        achievement:'FIRST STUDENT LEADER',
      },
      {
        kicker:'REAL TALK', title:'The Hardest Part, Honestly',
        bullets:[
          'Struggled to pull student leadership together and ended up doing a lot of it solo.',
          'No built-in rapport like I have with my current teams. I was figuring out who to lean on as I went.',
          'I loved it, but it was a lot. I want to be candid about the real cost of being first.'
        ],
      },
    ]
  },

  // Part 2: Space Techs
  {
    part: 2,
    name:'SPACE TECHS', tag:'BUILDING SOMETHING BIGGER', duration:'~8&ndash;10 MIN',
    moments: [
      {
        kicker:'CLASS CHANGE', title:'Helper → President',
        bullets:[
          'Went from helping establish the club to becoming its president.',
          'The transition: going from “helping out” to being the one accountable for the whole club.'
        ],
        boosts:[{key:'LEAD',amount:1}],
      },
      {
        type:'victory', kicker:'BOSS BATTLE CLEARED',
        title:'Space Vision 2025',
        sub:'Planetary Sunshade Proposal: 1st Place, Research Paper Competition, Seattle',
        itemTitle:'ITEM ACQUIRED: LUNAR REGOLITH',
        itemDesc:'Brought back a piece of compressed lunar regolith. We bring it out for events, a tangible symbol of what involvement produced.',
        boosts:[{key:'VIS',amount:1},{key:'RSC',amount:1}],
        achievement:'1ST PLACE: SPACE VISION 2025',
      },
      {
        kicker:'CURRENT QUEST LOG', title:'Fall 2026: In Progress',
        checklist:[
          {text:'HAB (high-altitude balloon) launch planned for October', status:'active'},
          {text:'Event calendar planned out through mid-December', status:'done'},
          {text:'Working with Dr. Phillips to make the club more accessible to OTC students', status:'active'}
        ],
      },
      {
        type:'roster', kicker:'PARTY MEMBERS', title:'Not a Solo Run',
        intro:'Looking ahead: my VP, Mack High, is pursuing rocketry certification. That’s a good beat to talk about growing other leaders, not just my own growth.',
        roster:[
          {icon:'👑', role:'PRESIDENT', name:'Shanna (me)'},
          {icon:'🚀', role:'VP, ROCKETRY CERT', name:'Mack High'},
          {icon:'💰', role:'TREASURER', name:'Geoffrey Wortham'},
          {icon:'🛰', role:'SEDS CHAPTER REP', name:'Jaidyn Straker'},
          {icon:'🧑‍🏫', role:'ADVISOR', name:'Chelsea Cozort'},
          {icon:'🧑‍🏫', role:'ADVISOR', name:'Daniel Kopsas'},
          {icon:'🧑‍🏫', role:'ADVISOR', name:'Todd Vangordan'}
        ],
        footer:'Arc for this section: join &rarr; build &rarr; lead &rarr; win &rarr; what’s next.',
      },
    ]
  },

  // Part 3: PTK
  {
    part: 3,
    name:'PTK', tag:'DEPTH OVER BREADTH', duration:'~6&ndash;8 MIN',
    moments: [
      {
        kicker:'DIFFERENT CLASS BUILD', title:'VP of Scholarship',
        bullets:[
          'A different kind of involvement: governance and scholarship, not building or running a club.',
          'Contrast with Space Techs: not every leadership role means running the show day-to-day.'
        ],
      },
      {
        kicker:'THE RESEARCH GUILD', title:'Honors in Action',
        bullets:[
          'Research question: what barriers do community college students face connecting with student orgs?',
          'My focus is specifically on students with disabilities.',
          'Interviewing Dr. April Phillips, OTC’s Director of Access and Accommodation Resources.'
        ],
        boosts:[{key:'RSC',amount:2}],
        achievement:'RESEARCHER',
      },
      {
        type:'dialogue', portrait:'🎓',
        name:'DR. APRIL PHILLIPS', role:'OTC Director of Access &amp; Accommodation Resources · formerly ran BEAR Power @ Missouri State University',
        text:'“Let’s talk about the barriers your students with disabilities actually face getting connected on this campus...”',
        footnote:'One of the interviews grounding the Honors in Action research.',
      },
      {
        type:'statement', kicker:'PLOT TWIST', title:'The Flip Side',
        statement:'Everything so far is why involvement matters to me. Honors in Action is me researching why other students don’t get there.',
        note:'This grounds the talk in real research, not just anecdote. It gives data-backed credibility, not just my personal story.',
      },
    ]
  },

  // Part 4: SGF Devs
  {
    part: 4,
    name:'SGF DEVS', tag:'WHERE INVOLVEMENT TAKES YOU', duration:'~6&ndash;8 MIN',
    moments: [
      {
        kicker:'NEW GAME +', title:'Campus → Community',
        bullets:[
          'My throughline: campus involvement leading to community involvement.',
          'I’m applying for a board position with SGF Devs.'
        ],
      },
      {
        kicker:'CHARACTER SHEET CHECK', title:'The Receipts',
        bullets:[
          'My Space Techs win and presidency.',
          'My PTK scholarship leadership and research.',
          'Being Tech2Gether’s first student leader.'
        ],
        boosts:[{key:'COM',amount:2}],
        achievement:'BOARD APPLICANT',
      },
      {
        type:'statement', kicker:'THE POINT', title:'The Point',
        statement:'My OTC involvement wasn’t separate from my professional path. It built the path.',
        note:'Keeping the focus on how campus leadership translated into being taken seriously in a professional community (not over-explaining Cold Brew Code here).',
      },
    ]
  },

  // Closing: no LEVEL title card, just the call to action and the recap.
  {
    part: 5,
    card: false,
    moments: [
      {
        type:'cta', kicker:'QUEST COMPLETE... FOR NOW', title:'Your Turn',
        body:'For the bonus-point crowd: here’s one small first step you could take this week.',
        ctas:['▶ JOIN TECH2GETHER', '▶ JOIN ANOTHER CLUB', '▶ TALK TO ME AFTER'],
      },
      {
        type:'final', kicker:'LEVEL UP COMPLETE',
        title:'Every Stage Built On The One Before It',
        recap:'TECH2GETHER &rarr; SPACE TECHS &rarr; PTK &rarr; SGF DEVS',
        achievement:'NEW GAME+ UNLOCKED',
        linkedin:'https://www.linkedin.com/in/shanna-graves-3413b4333/',
      },
    ]
  },

];