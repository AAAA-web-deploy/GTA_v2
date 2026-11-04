/* Editable, local story data. All routes and locations are fictional narrative. */
window.GTA_STORY = {
  characters: [
    {id:'anakin', name:'Anakin Skywalker', role:'The chosen driver', icon:'✧', image:'assets/images/03-crew-anakin.webp', bio:'A gifted pilot with the Force on his side, Anakin is ready to take the wheel when the mission gets complicated.'},
    {id:'padme', name:'Padmé Amidala', role:'The strategist', icon:'✦', image:'assets/images/04-crew-padme.webp', bio:'A sharp negotiator with an eye for detail, Padmé is determined to recover the artifact before it falls into the wrong hands.'},
    {id:'jason', name:'Jason Duval', role:'The local', icon:'◇', image:'assets/images/05-crew-jason.webp', bio:'Jason knows Leonida’s roads, shortcuts and back channels. When the plan goes sideways, he knows a way out.'},
    {id:'lucia', name:'Lucia Caminos', role:'The risk taker', icon:'✺', image:'assets/images/06-crew-lucia.webp', bio:'Resourceful under pressure, Lucia turns tight spots into opportunities and keeps the crew moving.'}
  ],
  routes: [
    {id:'heist', name:'The Heist Route', icon:'⬡', image:'assets/images/route-heist-new.webp', description:'Plan the job. Take the prize. Get away clean.', story:'Jason and Lucia plan a fast robbery while Anakin and Padmé prepare the escape. The artifact is close—but timing is everything.', outcome:'The crew recovers the artifact and escapes along the neon coast.', outcomeImage:'assets/images/16-outcome-heist.webp'},
    {id:'war', name:'The War Route', icon:'⚔', image:'assets/images/route-war-new.webp', description:'Take to the skies and outrun the patrol.', story:'The crew takes to the skies as a galactic patrol closes in over Vice City. Anakin takes the controls and sets a course through the clouds.', outcome:'Their ship clears the pursuit and emerges above the clouds.', outcomeImage:'assets/images/17-outcome-war.webp'},
    {id:'diplomacy', name:'The Diplomacy Route', icon:'◇', image:'assets/images/route-diplomacy-new.webp', description:'Negotiate a way out of a dangerous deal.', story:'Padmé negotiates with the artifact’s holders while the crew watches for surprises. The right words could turn the whole mission around.', outcome:'An agreement is reached, and the artifact changes hands peacefully.', outcomeImage:'assets/images/18-outcome-diplomacy.webp'}
  ],
  galactic: [
    {id:'vice-city',name:'Vice City',title:'The First Lead',x:50,y:61,image:'assets/images/destination-vice-city.webp',story:'Anakin and Padmé meet Jason and Lucia on the beachfront. A stolen galactic artifact has arrived in the city, and the crew has one night to find it.'},
    {id:'naboo',name:'Naboo',title:'The Royal Connection',x:19,y:22,image:'assets/images/destination-naboo.webp',story:'Padmé follows a lead to the royal city of Theed. An old contact knows who moved the artifact—and what it could unlock.'},
    {id:'coruscant',name:'Coruscant',title:'A City of Secrets',x:50,y:21,image:'assets/images/destination-coruscant.webp',story:'High above the traffic, Anakin and the crew seek records linking a galactic syndicate to the streets of Vice City.'},
    {id:'tatooine',name:'Tatooine',title:'Desert Run',x:85,y:48,image:'assets/images/destination-tatooine.webp',story:'A contact beneath the twin suns can identify the artifact, but the crew must first retrieve a missing data chip.'},
    {id:'geonosis',name:'Geonosis',title:'Through the Spires',x:81,y:23,image:'assets/images/destination-geonosis.webp',story:'The trail leads across the red canyons, where an abandoned landing site hides the syndicate’s next move.'},
    {id:'kamino',name:'Kamino',title:'The Ocean Signal',x:12,y:48,image:'assets/images/destination-kamino.webp',story:'A transmission from a city above the waves reveals a possible route for the artifact to leave Leonida.'}
  ],
  local: [
    {id:'vice-city',name:'Vice City',title:'Neon First Light',x:50,y:54,image:'assets/images/07-vice-city.webp',story:'A galactic signal surfaces on the neon coast. Anakin and Padmé meet the crew and follow the first clue through Vice City.',gallery:[
      {src:'assets/images/07-vice-city.webp',alt:'The crew gathers beside a car on the Vice City beach'},
      {src:'assets/images/locations/vice-a.webp',alt:'A rooftop view over Vice City and a mysterious spacecraft'},
      {src:'assets/images/locations/vice-b.webp',alt:'Anakin and Padmé step out of a sports car on a neon beach boulevard'}]},
    {id:'leonida-keys',name:'Leonida Keys',title:'The Island Signal',x:22,y:66,image:'assets/images/08-leonida-keys.webp',story:'A signal leads across the turquoise water and long bridges of the Leonida Keys to a secret hidden beneath the surface.',gallery:[
      {src:'assets/images/08-leonida-keys.webp',alt:'The crew arrives at an island dock in the Keys'},
      {src:'assets/images/locations/keys-a.webp',alt:'An elevated view of a speedboat crossing the Keys'},
      {src:'assets/images/locations/keys-b.webp',alt:'The crew investigates a mysterious light in the water'}]},
    {id:'port-gellhorn',name:'Port Gellhorn',title:'The Cargo Exchange',x:20,y:24,image:'assets/images/10-port-gellhorn.webp',story:'At Port Gellhorn, the team investigates a night shipment and a container that may hold the next piece of the puzzle.',gallery:[
      {src:'assets/images/10-port-gellhorn.webp',alt:'The crew examines a glowing cargo container at the port'},
      {src:'assets/images/locations/port-a.webp',alt:'A close look at a mysterious cargo crate in the rain'},
      {src:'assets/images/locations/port-b.webp',alt:'An elevated view across a neon industrial harbor'}]},
    {id:'grassrivers',name:'Grassrivers',title:'Beneath the Waterline',x:76,y:62,image:'assets/images/09-grassrivers.webp',story:'The trail slips into the wetlands. A light beneath the water guides the crew toward a secret hidden in the Grassrivers.',gallery:[
      {src:'assets/images/09-grassrivers.webp',alt:'An airboat skims across the wetlands at sunset'},
      {src:'assets/images/locations/grass-a.webp',alt:'An airboat above and a luminous discovery beneath the water'},
      {src:'assets/images/locations/grass-b.webp',alt:'An aerial view of an airboat crossing the marsh'}]},
    {id:'ambrosia',name:'Ambrosia',title:'The Refinery Run',x:52,y:15,image:'assets/images/11-ambrosia.webp',story:'In Ambrosia’s industrial heartland, a convoy points the team toward an unexpected off-world connection.',gallery:[
      {src:'assets/images/11-ambrosia.webp',alt:'The crew follows a convoy through the industrial heartland'},
      {src:'assets/images/locations/ambrosia-a.webp',alt:'A motorcycle ride past industrial smokestacks'},
      {src:'assets/images/locations/ambrosia-b.webp',alt:'The crew investigates a glowing shipment in a refinery'}]},
    {id:'mount-kalaga',name:'Mount Kalaga National Park',title:'The Mountain Horizon',x:79,y:16,image:'assets/images/12-mount-kalaga.webp',story:'The final local lead points high into Mount Kalaga National Park, where a starship waits beyond the ridge.',gallery:[
      {src:'assets/images/12-mount-kalaga.webp',alt:'The crew gathers in the mountains beside a starship'},
      {src:'assets/images/locations/kalaga-a.webp',alt:'An aerial view of a mountain road and hidden starship'},
      {src:'assets/images/locations/kalaga-b.webp',alt:'A closer view of the crew approaching a mountain overlook'}]}
  ]
};
