/*
  A content script that flags tracking requests.

  Copyright 2012 Disconnect, Inc.

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  This program is distributed in the hope that it will be useful, but WITHOUT
  ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
  FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

  You should have received a copy of the GNU General Public License along with
  this program. If not, see <http://www.gnu.org/licenses/>.

  Authors (one per line):

    Brian Kennish <byoogle@gmail.com>
*/

/* Parses a URL into a domain name and hostname, regex free. */
function getDomain(url) {
  anchor.href = url;
  var host = anchor.hostname;
  var labels = host.split('.');

  var len = labels.length;
  var tld = labels[len - 1];
  //
  if (isNaN(parseFloat(tld))) {

    // Second-level domains. We'll need to splice out *3* parts to get the proper domain name!!!
    // Info primarily taken from 'https://mxr.mozilla.org/mozilla-central/source/netwerk/dns/effective_tld_names.dat?raw=1',
    // **but with some changes**.
    var SLDs = {
      ac: [ 'com', 'edu', 'gov', 'net', 'mil', 'org' ],
      ad: [ 'nom' ],
      ae: [ 'co', 'net', 'org', 'sch', 'ac', 'gov', 'mil' ],
      aero: [ 'accident-investigation', 'accident-prevention', 'aerobatic', 'aeroclub', 'aerodrome', 'agents', 'aircraft', 'airline', 'airport', 'air-surveillance', 'airtraffic', 'air-traffic-control', 'ambulance', 'amusement', 'association', 'author', 'ballooning', 'broker', 'caa', 'cargo', 'catering', 'certification', 'championship', 'charter', 'civilaviation', 'club', 'conference', 'consultant', 'consulting', 'control', 'council', 'crew', 'design', 'dgca', 'educator', 'emergency', 'engine', 'engineer', 'entertainment', 'equipment', 'exchange', 'express', 'federation', 'flight', 'freight', 'fuel', 'gliding', 'government', 'groundhandling', 'group', 'hanggliding', 'homebuilt', 'insurance', 'journal', 'journalist', 'leasing', 'logistics', 'magazine', 'maintenance', 'marketplace', 'media', 'microlight', 'modelling', 'navigation', 'parachuting', 'paragliding', 'passenger-association', 'pilot', 'press', 'production', 'recreation', 'repbody', 'res', 'research', 'rotorcraft', 'safety', 'scientist', 'services', 'show', 'skydiving', 'software', 'student', 'taxi', 'trader', 'trading', 'trainer', 'union', 'workinggroup', 'works' ],
      af: [ 'gov', 'com', 'org', 'net', 'edu' ],
      ag: [ 'com', 'org', 'net', 'co', 'nom' ],
      ai: [ 'off', 'com', 'net', 'org' ],
      al: [ 'com', 'edu', 'gov', 'mil', 'net', 'org' ],
      an: [ 'com', 'net', 'org', 'edu' ],
      ao: [ 'ed', 'gv', 'og', 'co', 'pb', 'it' ],
      ar: [ 'com', 'edu', 'gob', 'gov', 'int', 'mil', 'net', 'org', 'tur' ],
        // !!-->  I dont know about the mozilla list for '.ar' (quoted below); but check out http://en.wikipedia.org/wiki/.ar ?!!!
        //       -------------
        //       // ar : http://en.wikipedia.org/wiki/.ar
        //       *.ar
        //       !congresodelalengua3.ar
        //       !educ.ar
        //       !gobiernoelectronico.ar
        //       !mecon.ar
        //       !nacion.ar
        //       !nic.ar
        //       !promocion.ar
        //       !retina.ar
        //       !uba.ar
        //       -------------
      arpa: [ 'e164', 'in-addr', 'ip6', 'iris', 'uri', 'urn' ],
      as: [ 'gov' ],
      at: [ 'ac', 'co', 'gv', 'or' ],
      au: [ 'com', 'net', 'org', 'edu', 'gov', 'csiro', 'asn', 'id', 'info', 'conf', 'oz', 'act', 'nsw', 'nt', 'qld', 'sa', 'tas', 'vic', 'wa' ],
      aw: [ 'com' ],
      az: [ 'com', 'net', 'int', 'gov', 'org', 'edu', 'info', 'pp', 'mil', 'name', 'pro', 'biz' ],
      ba: [ 'org', 'net', 'edu', 'gov', 'mil', 'unsa', 'unbi', 'co', 'com', 'rs' ],
      bb: [ 'biz', 'com', 'edu', 'gov', 'info', 'net', 'org', 'store' ],
      be: [ 'ac' ],
      bf: [ 'gov' ],
      bg: [ 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9' ],
      bh: [ 'com', 'edu', 'net', 'org', 'gov' ],
      bi: [ 'co', 'com', 'edu', 'or', 'org' ],
      bj: [ 'asso', 'barreau', 'gouv' ],
      bm: [ 'com', 'edu', 'gov', 'net', 'org' ],
      bo: [ 'com', 'edu', 'gov', 'gob', 'int', 'org', 'net', 'mil', 'tv' ],
      br: [ 'adm', 'adv', 'agr', 'am', 'arq', 'art', 'ato', 'b', 'bio', 'blog', 'bmd', 'can', 'cim', 'cng', 'cnt', 'com', 'coop', 'ecn', 'edu', 'emp', 'eng', 'esp', 'etc', 'eti', 'far', 'flog', 'fm', 'fnd', 'fot', 'fst', 'g12', 'ggf', 'gov', 'imb', 'ind', 'inf', 'jor', 'jus', 'lel', 'mat', 'med', 'mil', 'mus', 'net', 'nom', 'not', 'ntr', 'odo', 'org', 'ppg', 'pro', 'psc', 'psi', 'qsl', 'radio', 'rec', 'slg', 'srv', 'taxi', 'teo', 'tmp', 'trd', 'tur', 'tv', 'vet', 'vlog', 'wiki', 'zlg' ],
      bs: [ 'com', 'net', 'org', 'edu', 'gov' ],
      bt: [ 'com', 'edu', 'gov', 'net', 'org' ],
      bw: [ 'co', 'org' ],
      by: [ 'gov', 'mil', 'com', 'of' ],
      bz: [ 'com', 'net', 'org', 'edu', 'gov' ],
      ca: [ 'ab', 'bc', 'mb', 'nb', 'nf', 'nl', 'ns', 'nt', 'nu', 'on', 'pe', 'qc', 'sk', 'yk', 'gc' ],
      cd: [ 'gov' ],
      ci: [ 'org', 'or', 'com', 'co', 'edu', 'ed', 'ac', 'net', 'go', 'asso', 'aéroport', 'int', 'presse', 'md', 'gouv' ],
      ck: [ 'co', 'org', 'edu', 'gov', 'net', 'gen', 'biz', 'info' ],
        // !!-->  Using list from http://en.wikipedia.org/wiki/.ck instead; mozilla's entry:
        //       -------------
        //       // ck : http://en.wikipedia.org/wiki/.ck
        //       *.ck
        //       !www.ck
        //       -------------
      cl: [ 'gov', 'gob', 'co', 'mil' ],
      cm: [ 'gov' ],
      cn: [ 'ac', 'com', 'edu', 'gov', 'net', 'org', 'mil', 'ah', 'bj', 'cq', 'fj', 'gd', 'gs', 'gz', 'gx', 'ha', 'hb', 'he', 'hi', 'hl', 'hn', 'jl', 'js', 'jx', 'ln', 'nm', 'nx', 'qh', 'sc', 'sd', 'sh', 'sn', 'sx', 'tj', 'xj', 'xz', 'yn', 'zj', 'hk', 'mo', 'tw' ],
      co: [ 'arts', 'com', 'edu', 'firm', 'gov', 'info', 'int', 'mil', 'net', 'nom', 'org', 'rec', 'web' ],
      cr: [ 'ac', 'co', 'ed', 'fi', 'go', 'or', 'sa' ],
      cu: [ 'com', 'edu', 'org', 'net', 'gov', 'inf' ],
      cx: [ 'gov' ],
      dm: [ 'com', 'net', 'org', 'edu', 'gov' ],
      do: [ 'art', 'com', 'edu', 'gob', 'gov', 'mil', 'net', 'org', 'sld', 'web' ],
      dz: [ 'com', 'org', 'net', 'gov', 'edu', 'asso', 'pol', 'art' ],
      ec: [ 'com', 'info', 'net', 'fin', 'k12', 'med', 'pro', 'org', 'edu', 'gov', 'gob', 'mil' ],
      ee: [ 'edu', 'gov', 'riik', 'lib', 'med', 'com', 'pri', 'aip', 'org', 'fie' ],
      eg: [ 'com', 'edu', 'eun', 'gov', 'mil', 'name', 'net', 'org', 'sci' ],
      es: [ 'com', 'nom', 'org', 'gob', 'edu' ],
      fi: [ 'aland' ],
      fr: [ 'com', 'asso', 'nom', 'prd', 'presse', 'tm', 'aeroport', 'assedic', 'avocat', 'avoues', 'cci', 'chambagri', 'chirurgiens-dentistes', 'experts-comptables', 'geometre-expert', 'gouv', 'greta', 'huissier-justice', 'medecin', 'notaires', 'pharmacien', 'port', 'veterinaire' ],
      ge: [ 'com', 'edu', 'gov', 'org', 'mil', 'net', 'pvt' ],
      gg: [ 'co', 'org', 'net', 'sch', 'gov' ],
      gh: [ 'com', 'edu', 'gov', 'org', 'mil' ],
      gi: [ 'com', 'ltd', 'gov', 'mod', 'edu', 'org' ],
      gn: [ 'ac', 'com', 'edu', 'gov', 'org', 'net' ],
      gp: [ 'com', 'net', 'mobi', 'edu', 'org', 'asso' ],
      gr: [ 'com', 'edu', 'net', 'org', 'gov' ],
      gy: [ 'co', 'com', 'net' ],
      hk: [ 'com', 'edu', 'gov', 'idv', 'net', 'org' ],
      hn: [ 'com', 'edu', 'org', 'net', 'mil', 'gob' ],
      hr: [ 'iz', 'from', 'name', 'com' ],
      ht: [ 'com', 'shop', 'firm', 'info', 'adult', 'net', 'pro', 'org', 'med', 'art', 'coop', 'pol', 'asso', 'edu', 'rel', 'gouv', 'perso' ],
      hu: [ 'co', 'info', 'org', 'priv', 'sport', 'tm', '2000', 'agrar', 'bolt', 'casino', 'city', 'erotica', 'erotika', 'film', 'forum', 'games', 'hotel', 'ingatlan', 'jogasz', 'konyvelo', 'lakas', 'media', 'news', 'reklam', 'sex', 'shop', 'suli', 'szex', 'tozsde', 'utazas', 'video' ],
      id: [ 'ac', 'co', 'go', 'mil', 'net', 'or', 'sch', 'web' ],
      ie: [ 'gov' ],
      im: [ 'co', 'net', 'gov', 'org', 'nic', 'ac' ],
      in: [ 'co', 'firm', 'net', 'org', 'gen', 'ind', 'nic', 'ac', 'edu', 'res', 'gov', 'mil' ],
      int: [ 'eu' ],
      io: [ 'com' ],
      iq: [ 'gov', 'edu', 'mil', 'com', 'org', 'net' ],
      ir: [ 'ac', 'co', 'gov', 'id', 'net', 'org', 'sch' ],
      is: [ 'net', 'com', 'edu', 'gov', 'org', 'int' ],


      it: [ 'gov', 'edu', 'agrigento', 'ag', 'alessandria', 'al', 'ancona', 'an', 'aosta', 'aoste', 'ao', 'arezzo', 'ar', 'ascoli-piceno', 'ascolipiceno', 'ap', 'asti', 'at', 'avellino', 'av', 'bari', 'ba', 'andria-barletta-trani', 'andriabarlettatrani', 'trani-barletta-andria', 'tranibarlettaandria', 'barletta-trani-andria', 'barlettatraniandria', 'andria-trani-barletta', 'andriatranibarletta', 'trani-andria-barletta', 'traniandriabarletta', 'bt', 'belluno', 'bl', 'benevento', 'bn', 'bergamo', 'bg', 'biella', 'bi', 'bologna', 'bo', 'bolzano', 'bozen', 'balsan', 'alto-adige', 'altoadige', 'suedtirol', 'bz', 'brescia', 'bs', 'brindisi', 'br', 'cagliari', 'ca', 'caltanissetta', 'cl', 'campobasso', 'cb', 'carboniaiglesias', 'carbonia-iglesias', 'iglesias-carbonia', 'iglesiascarbonia', 'ci', 'caserta', 'ce', 'catania', 'ct', 'catanzaro', 'cz', 'chieti', 'ch', 'como', 'co', 'cosenza', 'cs', 'cremona', 'cr', 'crotone', 'kr', 'cuneo', 'cn', 'dell-ogliastra', 'dellogliastra', 'ogliastra', 'og', 'enna', 'en', 'ferrara', 'fe', 'fermo', 'fm', 'firenze', 'florence', 'fi', 'foggia', 'fg', 'forli-cesena', 'forlicesena', 'cesena-forli', 'cesenaforli', 'fc', 'frosinone', 'fr', 'genova', 'genoa', 'ge', 'gorizia', 'go', 'grosseto', 'gr', 'imperia', 'im', 'isernia', 'is', 'laquila', 'aquila', 'aq', 'la-spezia', 'laspezia', 'sp', 'latina', 'lt', 'lecce', 'le', 'lecco', 'lc', 'livorno', 'li', 'lodi', 'lo', 'lucca', 'lu', 'macerata', 'mc', 'mantova', 'mn', 'massa-carrara', 'massacarrara', 'carrara-massa', 'carraramassa', 'ms', 'matera', 'mt', 'medio-campidano', 'mediocampidano', 'campidano-medio', 'campidanomedio', 'vs', 'messina', 'me', 'milano', 'milan', 'mi', 'modena', 'mo', 'monza', 'monza-brianza', 'monzabrianza', 'monzaebrianza', 'monzaedellabrianza', 'monza-e-della-brianza', 'mb', 'napoli', 'naples', 'na', 'novara', 'no', 'nuoro', 'nu', 'oristano', 'or', 'padova', 'padua', 'pd', 'palermo', 'pa', 'parma', 'pr', 'pavia', 'pv', 'perugia', 'pg', 'pescara', 'pe', 'pesaro-urbino', 'pesarourbino', 'urbino-pesaro', 'urbinopesaro', 'pu', 'piacenza', 'pc', 'pisa', 'pi', 'pistoia', 'pt', 'pordenone', 'pn', 'potenza', 'pz', 'prato', 'po', 'ragusa', 'rg', 'ravenna', 'ra', 'reggio-calabria', 'reggiocalabria', 'rc', 'reggio-emilia', 'reggioemilia', 're', 'rieti', 'ri', 'rimini', 'rn', 'roma', 'rome', 'rm', 'rovigo', 'ro', 'salerno', 'sa', 'sassari', 'ss', 'savona', 'sv', 'siena', 'si', 'siracusa', 'sr', 'sondrio', 'so', 'taranto', 'ta', 'tempio-olbia', 'tempioolbia', 'olbia-tempio', 'olbiatempio', 'ot', 'teramo', 'te', 'terni', 'tr', 'torino', 'turin', 'to', 'trapani', 'tp', 'trento', 'trentino', 'tn', 'treviso', 'tv', 'trieste', 'ts', 'udine', 'ud', 'varese', 'va', 'venezia', 'venice', 've', 'verbania', 'vb', 'vercelli', 'vc', 'verona', 'vr', 'vibo-valentia', 'vibovalentia', 'vv', 'vicenza', 'vi', 'viterbo', 'vt' ],


      je: [ 'co', 'org', 'net', 'sch', 'gov' ],
      jo: [ 'com', 'org', 'net', 'edu', 'sch', 'gov', 'mil', 'name' ],
      jp: [ 'ac', 'ad', 'co', 'ed', 'go', 'gr', 'lg', 'ne', 'or' ],
      kg: [ 'org', 'net', 'com', 'edu', 'gov', 'mil' ],
      ki: [ 'edu', 'biz', 'net', 'org', 'gov', 'info', 'com' ],
      km: [ 'org', 'nom', 'gov', 'prd', 'tm', 'edu', 'mil', 'ass', 'com', 'coop', 'asso', 'presse', 'medecin', 'notaires', 'pharmaciens', 'veterinaire', 'gouv' ],
      kn: [ 'net', 'org', 'edu', 'gov' ],
      kp: [ 'com', 'edu', 'gov', 'org', 'rep', 'tra' ],
      kr: [ 'ac', 'co', 'es', 'go', 'hs', 'kg', 'mil', 'ms', 'ne', 'or', 'pe', 're', 'sc', 'busan', 'chungbuk', 'chungnam', 'daegu', 'daejeon', 'gangwon', 'gwangju', 'gyeongbuk', 'gyeonggi', 'gyeongnam', 'incheon', 'jeju', 'jeonbuk', 'jeonnam', 'seoul', 'ulsan' ],
      ky: [ 'edu', 'gov', 'com', 'org', 'net' ],
      kz: [ 'org', 'edu', 'net', 'gov', 'mil', 'com' ],
      la: [ 'int', 'net', 'info', 'edu', 'gov', 'per', 'com', 'org' ],
      lb: [ 'com', 'edu', 'gov', 'net', 'org' ],
      lc: [ 'com', 'net', 'co', 'org', 'edu', 'gov' ],
      lk: [ 'gov', 'sch', 'net', 'int', 'com', 'org', 'edu', 'ngo', 'soc', 'web', 'ltd', 'assn', 'grp', 'hotel' ],
      lr: [ 'com', 'edu', 'gov', 'org', 'net' ],
      ls: [ 'co', 'org' ],
      lt: [ 'gov' ],
      lv: [ 'com', 'edu', 'gov', 'org', 'mil', 'id', 'net', 'asn', 'conf' ],
      ly: [ 'com', 'net', 'gov', 'plc', 'edu', 'sch', 'med', 'org', 'id' ],
      ma: [ 'co', 'net', 'gov', 'org', 'ac', 'press' ],
      mc: [ 'tm', 'asso' ],
      me: [ 'co', 'net', 'org', 'edu', 'ac', 'gov', 'its', 'priv' ],
      mg: [ 'org', 'nom', 'gov', 'prd', 'tm', 'edu', 'mil', 'com' ],
      mk: [ 'com', 'org', 'net', 'edu', 'gov', 'inf', 'name' ],
      ml: [ 'com', 'edu', 'gouv', 'gov', 'net', 'org', 'presse' ],
      mn: [ 'gov', 'edu', 'org' ],
      mo: [ 'com', 'net', 'org', 'edu', 'gov' ],
      mr: [ 'gov' ],
      mu: [ 'com', 'net', 'org', 'gov', 'ac', 'co', 'or' ],


      museum: [ 'academy', 'agriculture', 'air', 'airguard', 'alabama', 'alaska', 'amber', 'ambulance', 'american', 'americana', 'americanantiques', 'americanart', 'amsterdam', 'and', 'annefrank', 'anthro', 'anthropology', 'antiques', 'aquarium', 'arboretum', 'archaeological', 'archaeology', 'architecture', 'art', 'artanddesign', 'artcenter', 'artdeco', 'arteducation', 'artgallery', 'arts', 'artsandcrafts', 'asmatart', 'assassination', 'assisi', 'association', 'astronomy', 'atlanta', 'austin', 'australia', 'automotive', 'aviation', 'axis', 'badajoz', 'baghdad', 'bahn', 'bale', 'baltimore', 'barcelona', 'baseball', 'basel', 'baths', 'bauern', 'beauxarts', 'beeldengeluid', 'bellevue', 'bergbau', 'berkeley', 'berlin', 'bern', 'bible', 'bilbao', 'bill', 'birdart', 'birthplace', 'bonn', 'boston', 'botanical', 'botanicalgarden', 'botanicgarden', 'botany', 'brandywinevalley', 'brasil', 'bristol', 'british', 'britishcolumbia', 'broadcast', 'brunel', 'brussel', 'brussels', 'bruxelles', 'building', 'burghof', 'bus', 'bushey', 'cadaques', 'california', 'cambridge', 'can', 'canada', 'capebreton', 'carrier', 'cartoonart', 'casadelamoneda', 'castle', 'castres', 'celtic', 'center', 'chattanooga', 'cheltenham', 'chesapeakebay', 'chicago', 'children', 'childrens', 'childrensgarden', 'chiropractic', 'chocolate', 'christiansburg', 'cincinnati', 'cinema', 'circus', 'civilisation', 'civilization', 'civilwar', 'clinton', 'clock', 'coal', 'coastaldefence', 'cody', 'coldwar', 'collection', 'colonialwilliamsburg', 'coloradoplateau', 'columbia', 'columbus', 'communication', 'communications', 'community', 'computer', 'computerhistory', 'comunicações', 'contemporary', 'contemporaryart', 'convent', 'copenhagen', 'corporation', 'correios-e-telecomunicações', 'corvette', 'costume', 'countryestate', 'county', 'crafts', 'cranbrook', 'creation', 'cultural', 'culturalcenter', 'culture', 'cyber', 'cymru', 'dali', 'dallas', 'database', 'ddr', 'decorativearts', 'delaware', 'delmenhorst', 'denmark', 'depot', 'design', 'detroit', 'dinosaur', 'discovery', 'dolls', 'donostia', 'durham', 'eastafrica', 'eastcoast', 'education', 'educational', 'egyptian', 'eisenbahn', 'elburg', 'elvendrell', 'embroidery', 'encyclopedic', 'england', 'entomology', 'environment', 'environmentalconservation', 'epilepsy', 'essex', 'estate', 'ethnology', 'exeter', 'exhibition', 'family', 'farm', 'farmequipment', 'farmers', 'farmstead', 'field', 'figueres', 'filatelia', 'film', 'fineart', 'finearts', 'finland', 'flanders', 'florida', 'force', 'fortmissoula', 'fortworth', 'foundation', 'francaise', 'frankfurt', 'franziskaner', 'freemasonry', 'freiburg', 'fribourg', 'frog', 'fundacio', 'furniture', 'gallery', 'garden', 'gateway', 'geelvinck', 'gemological', 'geology', 'georgia', 'giessen', 'glas', 'glass', 'gorge', 'grandrapids', 'graz', 'guernsey', 'halloffame', 'hamburg', 'handson', 'harvestcelebration', 'hawaii', 'health', 'heimatunduhren', 'hellas', 'helsinki', 'hembygdsforbund', 'heritage', 'histoire', 'historical', 'historicalsociety', 'historichouses', 'historisch', 'historisches', 'history', 'historyofscience', 'horology', 'house', 'humanities', 'illustration', 'imageandsound', 'indian', 'indiana', 'indianapolis', 'indianmarket', 'intelligence', 'interactive', 'iraq', 'iron', 'isleofman', 'jamison', 'jefferson', 'jerusalem', 'jewelry', 'jewish', 'jewishart', 'jfk', 'journalism', 'judaica', 'judygarland', 'juedisches', 'juif', 'karate', 'karikatur', 'kids', 'koebenhavn', 'koeln', 'kunst', 'kunstsammlung', 'kunstunddesign', 'labor', 'labour', 'lajolla', 'lancashire', 'landes', 'lans', 'läns', 'larsson', 'lewismiller', 'lincoln', 'linz', 'living', 'livinghistory', 'localhistory', 'london', 'losangeles', 'louvre', 'loyalist', 'lucerne', 'luxembourg', 'luzern', 'mad', 'madrid', 'mallorca', 'manchester', 'mansion', 'mansions', 'manx', 'marburg', 'maritime', 'maritimo', 'maryland', 'marylhurst', 'media', 'medical', 'medizinhistorisches', 'meeres', 'memorial', 'mesaverde', 'michigan', 'midatlantic', 'military', 'mill', 'miners', 'mining', 'minnesota', 'missile', 'missoula', 'modern', 'moma', 'money', 'monmouth', 'monticello', 'montreal', 'moscow', 'motorcycle', 'muenchen', 'muenster', 'mulhouse', 'muncie', 'museet', 'museumcenter', 'museumvereniging', 'music', 'national', 'nationalfirearms', 'nationalheritage', 'nativeamerican', 'naturalhistory', 'naturalhistorymuseum', 'naturalsciences', 'nature', 'naturhistorisches', 'natuurwetenschappen', 'naumburg', 'naval', 'nebraska', 'neues', 'newhampshire', 'newjersey', 'newmexico', 'newport', 'newspaper', 'newyork', 'niepce', 'norfolk', 'north', 'nrw', 'nuernberg', 'nuremberg', 'nyc', 'nyny', 'oceanographic', 'oceanographique', 'omaha', 'online', 'ontario', 'openair', 'oregon', 'oregontrail', 'otago', 'oxford', 'pacific', 'paderborn', 'palace', 'paleo', 'palmsprings', 'panama', 'paris', 'pasadena', 'pharmacy', 'philadelphia', 'philadelphiaarea', 'philately', 'phoenix', 'photography', 'pilots', 'pittsburgh', 'planetarium', 'plantation', 'plants', 'plaza', 'portal', 'portland', 'portlligat', 'posts-and-telecommunications', 'preservation', 'presidio', 'press', 'project', 'public', 'pubol', 'quebec', 'railroad', 'railway', 'research', 'resistance', 'riodejaneiro', 'rochester', 'rockart', 'roma', 'russia', 'saintlouis', 'salem', 'salvadordali', 'salzburg', 'sandiego', 'sanfrancisco', 'santabarbara', 'santacruz', 'santafe', 'saskatchewan', 'satx', 'savannahga', 'schlesisches', 'schoenbrunn', 'schokoladen', 'school', 'schweiz', 'science', 'scienceandhistory', 'scienceandindustry', 'sciencecenter', 'sciencecenters', 'science-fiction', 'sciencehistory', 'sciences', 'sciencesnaturelles', 'scotland', 'seaport', 'settlement', 'settlers', 'shell', 'sherbrooke', 'sibenik', 'silk', 'ski', 'skole', 'society', 'sologne', 'soundandvision', 'southcarolina', 'southwest', 'space', 'spy', 'square', 'stadt', 'stalbans', 'starnberg', 'state', 'stateofdelaware', 'station', 'steam', 'steiermark', 'stjohn', 'stockholm', 'stpetersburg', 'stuttgart', 'suisse', 'surgeonshall', 'surrey', 'svizzera', 'sweden', 'sydney', 'tank', 'tcm', 'technology', 'telekommunikation', 'television', 'texas', 'textile', 'theater', 'time', 'timekeeping', 'topology', 'torino', 'touch', 'town', 'transport', 'tree', 'trolley', 'trust', 'trustee', 'uhren', 'ulm', 'undersea', 'university', 'usa', 'usantiques', 'usarts', 'uscountryestate', 'usculture', 'usdecorativearts', 'usgarden', 'ushistory', 'ushuaia', 'uslivinghistory', 'utah', 'uvic', 'valley', 'vantaa', 'versailles', 'viking', 'village', 'virginia', 'virtual', 'virtuel', 'vlaanderen', 'volkenkunde', 'wales', 'wallonie', 'war', 'washingtondc', 'watchandclock', 'watch-and-clock', 'western', 'westfalen', 'whaling', 'wildlife', 'williamsburg', 'windmill', 'workshop', 'york', 'yorkshire', 'yosemite', 'youth', 'zoological', 'zoology' ],


      mv: [ 'aero', 'biz', 'com', 'coop', 'edu', 'gov', 'info', 'int', 'mil', 'museum', 'name', 'net', 'org', 'pro' ],
      mw: [ 'ac', 'biz', 'co', 'com', 'coop', 'edu', 'gov', 'int', 'museum', 'net', 'org' ],
      mx: [ 'com', 'org', 'gob', 'edu', 'net' ],
      my: [ 'com', 'net', 'org', 'gov', 'edu', 'mil', 'name' ],
      na: [ 'info', 'pro', 'name', 'school', 'or', 'dr', 'us', 'mx', 'ca', 'in', 'cc', 'tv', 'ws', 'mobi', 'co', 'com', 'org' ],
      nc: [ 'asso' ],
      nf: [ 'com', 'net', 'per', 'rec', 'web', 'arts', 'firm', 'info', 'other', 'store' ],
      ng: [ 'ac', 'com', 'edu', 'gov', 'net', 'org' ],
      nl: [ 'bv', 'co' ],


      no: [ 'fhs', 'vgs', 'fylkesbibl', 'folkebibl', 'museum', 'idrett', 'priv', 'mil', 'stat', 'dep', 'kommune', 'herad', 'aa', 'ah', 'bu', 'fm', 'hl', 'hm', 'jan-mayen', 'mr', 'nl', 'nt', 'of', 'ol', 'oslo', 'rl', 'sf', 'st', 'svalbard', 'tm', 'tr', 'va', 'vf', 'akrehamn', 'åkrehamn', 'algard', 'ålgård', 'arna', 'brumunddal', 'bryne', 'bronnoysund', 'brønnøysund', 'drobak', 'drøbak', 'egersund', 'fetsund', 'floro', 'florø', 'fredrikstad', 'hokksund', 'honefoss', 'hønefoss', 'jessheim', 'jorpeland', 'jørpeland', 'kirkenes', 'kopervik', 'krokstadelva', 'langevag', 'langevåg', 'leirvik', 'mjondalen', 'mjøndalen', 'mo-i-rana', 'mosjoen', 'mosjøen', 'nesoddtangen', 'orkanger', 'osoyro', 'osøyro', 'raholt', 'råholt', 'sandnessjoen', 'sandnessjøen', 'skedsmokorset', 'slattum', 'spjelkavik', 'stathelle', 'stavern', 'stjordalshalsen', 'stjørdalshalsen', 'tananger', 'tranby', 'vossevangen', 'afjord', 'åfjord', 'agdenes', 'al', 'ål', 'alesund', 'ålesund', 'alstahaug', 'alta', 'áltá', 'alaheadju', 'álaheadju', 'alvdal', 'amli', 'åmli', 'amot', 'åmot', 'andebu', 'andoy', 'andøy', 'andasuolo', 'ardal', 'årdal', 'aremark', 'arendal', 'ås', 'aseral', 'åseral', 'asker', 'askim', 'askvoll', 'askoy', 'askøy', 'asnes', 'åsnes', 'audnedaln', 'aukra', 'aure', 'aurland', 'aurskog-holand', 'aurskog-høland', 'austevoll', 'austrheim', 'averoy', 'averøy', 'balestrand', 'ballangen', 'balat', 'bálát', 'balsfjord', 'bahccavuotna', 'báhccavuotna', 'bamble', 'bardu', 'beardu', 'beiarn', 'bajddar', 'bájddar', 'baidar', 'báidár', 'berg', 'bergen', 'berlevag', 'berlevåg', 'bearalvahki', 'bearalváhki', 'bindal', 'birkenes', 'bjarkoy', 'bjarkøy', 'bjerkreim', 'bjugn', 'bodo', 'bodø', 'badaddja', 'bådåddjå', 'budejju', 'bokn', 'bremanger', 'bronnoy', 'brønnøy', 'bygland', 'bykle', 'barum', 'bærum', 'bievat', 'bievát', 'bomlo', 'bømlo', 'batsfjord', 'båtsfjord', 'bahcavuotna', 'báhcavuotna', 'dovre', 'drammen', 'drangedal', 'dyroy', 'dyrøy', 'donna', 'dønna', 'eid', 'eidfjord', 'eidsberg', 'eidskog', 'eidsvoll', 'eigersund', 'elverum', 'enebakk', 'engerdal', 'etne', 'etnedal', 'evenes', 'evenassi', 'evenášši', 'evje-og-hornnes', 'farsund', 'fauske', 'fuossko', 'fuoisku', 'fedje', 'fet', 'finnoy', 'finnøy', 'fitjar', 'fjaler', 'fjell', 'flakstad', 'flatanger', 'flekkefjord', 'flesberg', 'flora', 'fla', 'flå', 'folldal', 'forsand', 'fosnes', 'frei', 'frogn', 'froland', 'frosta', 'frana', 'fræna', 'froya', 'frøya', 'fusa', 'fyresdal', 'forde', 'førde', 'gamvik', 'gangaviika', 'gáŋgaviika', 'gaular', 'gausdal', 'gildeskal', 'gildeskål', 'giske', 'gjemnes', 'gjerdrum', 'gjerstad', 'gjesdal', 'gjovik', 'gjøvik', 'gloppen', 'gol', 'gran', 'grane', 'granvin', 'gratangen', 'grimstad', 'grong', 'kraanghke', 'kråanghke', 'grue', 'gulen', 'hadsel', 'halden', 'halsa', 'hamar', 'hamaroy', 'habmer', 'hábmer', 'hapmir', 'hápmir', 'hammerfest', 'hammarfeasta', 'hámmárfeasta', 'haram', 'hareid', 'harstad', 'hasvik', 'aknoluokta', 'ákŋoluokta', 'hattfjelldal', 'aarborte', 'haugesund', 'hemne', 'hemnes', 'hemsedal', 'hitra', 'hjartdal', 'hjelmeland', 'hobol', 'hobøl', 'hof', 'hol', 'hole', 'holmestrand', 'holtalen', 'holtålen', 'hornindal', 'horten', 'hurdal', 'hurum', 'hvaler', 'hyllestad', 'hagebostad', 'hægebostad', 'hoyanger', 'høyanger', 'hoylandet', 'høylandet', 'ha', 'hå', 'ibestad', 'inderoy', 'inderøy', 'iveland', 'jevnaker', 'jondal', 'jolster', 'jølster', 'karasjok', 'karasjohka', 'kárášjohka', 'karlsoy', 'galsa', 'gálsá', 'karmoy', 'karmøy', 'kautokeino', 'guovdageaidnu', 'klepp', 'klabu', 'klæbu', 'kongsberg', 'kongsvinger', 'kragero', 'kragerø', 'kristiansand', 'kristiansund', 'krodsherad', 'krødsherad', 'kvalsund', 'rahkkeravju', 'ráhkkerávju', 'kvam', 'kvinesdal', 'kvinnherad', 'kviteseid', 'kvitsoy', 'kvitsøy', 'kvafjord', 'kvæfjord', 'giehtavuoatna', 'kvanangen', 'kvænangen', 'navuotna', 'návuotna', 'kafjord', 'kåfjord', 'gaivuotna', 'gáivuotna', 'larvik', 'lavangen', 'lavagis', 'loabat', 'loabát', 'lebesby', 'davvesiida', 'leikanger', 'leirfjord', 'leka', 'leksvik', 'lenvik', 'leangaviika', 'leaŋgaviika', 'lesja', 'levanger', 'lier', 'lierne', 'lillehammer', 'lillesand', 'lindesnes', 'lindas', 'lindås', 'lom', 'loppa', 'lahppi', 'láhppi', 'lund', 'lunner', 'luroy', 'lurøy', 'luster', 'lyngdal', 'lyngen', 'ivgu', 'lardal', 'lerdal', 'lærdal', 'lodingen', 'lødingen', 'lorenskog', 'lørenskog', 'loten', 'løten', 'malvik', 'masoy', 'måsøy', 'muosat', 'muosát', 'mandal', 'marker', 'marnardal', 'masfjorden', 'meland', 'meldal', 'melhus', 'meloy', 'meløy', 'meraker', 'meråker', 'moareke', 'moåreke', 'midsund', 'midtre-gauldal', 'modalen', 'modum', 'molde', 'moskenes', 'moss', 'mosvik', 'malselv', 'målselv', 'malatvuopmi', 'málatvuopmi', 'namdalseid', 'aejrie', 'namsos', 'namsskogan', 'naamesjevuemie', 'nååmesjevuemie', 'laakesvuemie', 'nannestad', 'narvik', 'narviika', 'naustdal', 'nedre-eiker', 'nesna', 'nesodden', 'nesseby', 'unjarga', 'unjárga', 'nesset', 'nissedal', 'nittedal', 'nord-aurdal', 'nord-fron', 'nord-odal', 'norddal', 'nordkapp', 'davvenjarga', 'davvenjárga', 'nordre-land', 'nordreisa', 'raisa', 'ráisa', 'nore-og-uvdal', 'notodden', 'naroy', 'nærøy', 'notteroy', 'nøtterøy', 'odda', 'oksnes', 'øksnes', 'oppdal', 'oppegard', 'oppegård', 'orkdal', 'orland', 'ørland', 'orskog', 'ørskog', 'orsta', 'ørsta', 'osen', 'osteroy', 'osterøy', 'ostre-toten', 'østre-toten', 'overhalla', 'ovre-eiker', 'øvre-eiker', 'oyer', 'øyer', 'oygarden', 'øygarden', 'oystre-slidre', 'øystre-slidre', 'porsanger', 'porsangu', 'porsáŋgu', 'porsgrunn', 'radoy', 'radøy', 'rakkestad', 'rana', 'ruovat', 'randaberg', 'rauma', 'rendalen', 'rennebu', 'rennesoy', 'rennesøy', 'rindal', 'ringebu', 'ringerike', 'ringsaker', 'rissa', 'risor', 'risør', 'roan', 'rollag', 'rygge', 'ralingen', 'rælingen', 'rodoy', 'rødøy', 'romskog', 'rømskog', 'roros', 'røros', 'rost', 'røst', 'royken', 'røyken', 'royrvik', 'røyrvik', 'rade', 'råde', 'salangen', 'siellak', 'saltdal', 'salat', 'sálát', 'sálat', 'samnanger', 'sandefjord', 'sandnes', 'sandoy', 'sandøy', 'sarpsborg', 'sauda', 'sauherad', 'sel', 'selbu', 'selje', 'seljord', 'sigdal', 'siljan', 'sirdal', 'skaun', 'skedsmo', 'ski', 'skien', 'skiptvet', 'skjervoy', 'skjervøy', 'skierva', 'skiervá', 'skjak', 'skjåk', 'skodje', 'skanland', 'skånland', 'skanit', 'skánit', 'smola', 'smøla', 'snillfjord', 'snasa', 'snåsa', 'snoasa', 'snaase', 'snåase', 'sogndal', 'sokndal', 'sola', 'solund', 'songdalen', 'sortland', 'spydeberg', 'stange', 'stavanger', 'steigen', 'steinkjer', 'stjordal', 'stjørdal', 'stokke', 'stor-elvdal', 'stord', 'stordal', 'storfjord', 'omasvuotna', 'strand', 'stranda', 'stryn', 'sula', 'suldal', 'sund', 'sunndal', 'surnadal', 'sveio', 'svelvik', 'sykkylven', 'sogne', 'søgne', 'somna', 'sømna', 'sondre-land', 'søndre-land', 'sor-aurdal', 'sør-aurdal', 'sor-fron', 'sør-fron', 'sor-odal', 'sør-odal', 'sor-varanger', 'sør-varanger', 'matta-varjjat', 'mátta-várjjat', 'sorfold', 'sørfold', 'sorreisa', 'sørreisa', 'sorum', 'sørum', 'tana', 'deatnu', 'time', 'tingvoll', 'tinn', 'tjeldsund', 'dielddanuorri', 'tjome', 'tjøme', 'tokke', 'tolga', 'torsken', 'tranoy', 'tranøy', 'tromso', 'tromsø', 'tromsa', 'romsa', 'trondheim', 'troandin', 'trysil', 'trana', 'træna', 'trogstad', 'trøgstad', 'tvedestrand', 'tydal', 'tynset', 'tysfjord', 'divtasvuodna', 'divttasvuotna', 'tysnes', 'tysvar', 'tysvær', 'tonsberg', 'tønsberg', 'ullensaker', 'ullensvang', 'ulvik', 'utsira', 'vadso', 'vadsø', 'cahcesuolo', 'čáhcesuolo', 'vaksdal', 'valle', 'vang', 'vanylven', 'vardo', 'vardø', 'varggat', 'várggát', 'vefsn', 'vaapste', 'vega', 'vegarshei', 'vegårshei', 'vennesla', 'verdal', 'verran', 'vestby', 'vestnes', 'vestre-slidre', 'vestre-toten', 'vestvagoy', 'vestvågøy', 'vevelstad', 'vik', 'vikna', 'vindafjord', 'volda', 'voss', 'varoy', 'værøy', 'vagan', 'vågan', 'voagat', 'vagsoy', 'vågsøy', 'vaga', 'vågå', 'co' ],


      nr: [ 'biz', 'info', 'gov', 'edu', 'org', 'net', 'com' ],
      pa: [ 'ac', 'gob', 'com', 'org', 'sld', 'edu', 'net', 'ing', 'abo', 'med', 'nom' ],
      pe: [ 'edu', 'gob', 'nom', 'mil', 'org', 'com', 'net' ],
      pf: [ 'com', 'org', 'edu' ],
      ph: [ 'com', 'net', 'org', 'gov', 'edu', 'ngo', 'mil', 'i' ],
      pk: [ 'com', 'net', 'edu', 'org', 'fam', 'biz', 'web', 'gov', 'gob', 'gok', 'gon', 'gop', 'gos', 'info' ],


      pl: [ 'aid', 'agro', 'atm', 'auto', 'biz', 'com', 'edu', 'gmina', 'gsm', 'info', 'mail', 'miasta', 'media', 'mil', 'net', 'nieruchomosci', 'nom', 'org', 'pc', 'powiat', 'priv', 'realestate', 'rel', 'sex', 'shop', 'sklep', 'sos', 'szkola', 'targi', 'tm', 'tourism', 'travel', 'turystyka', '6bone', 'art', 'mbone', 'gov', 'ngo', 'irc', 'usenet', 'augustow', 'babia-gora', 'bedzin', 'beskidy', 'bialowieza', 'bialystok', 'bielawa', 'bieszczady', 'boleslawiec', 'bydgoszcz', 'bytom', 'cieszyn', 'czeladz', 'czest', 'dlugoleka', 'elblag', 'elk', 'glogow', 'gniezno', 'gorlice', 'grajewo', 'ilawa', 'jaworzno', 'jelenia-gora', 'jgora', 'kalisz', 'kazimierz-dolny', 'karpacz', 'kartuzy', 'kaszuby', 'katowice', 'kepno', 'ketrzyn', 'klodzko', 'kobierzyce', 'kolobrzeg', 'konin', 'konskowola', 'kutno', 'lapy', 'lebork', 'legnica', 'lezajsk', 'limanowa', 'lomza', 'lowicz', 'lubin', 'lukow', 'malbork', 'malopolska', 'mazowsze', 'mazury', 'mielec', 'mielno', 'mragowo', 'naklo', 'nowaruda', 'nysa', 'olawa', 'olecko', 'olkusz', 'olsztyn', 'opoczno', 'opole', 'ostroda', 'ostroleka', 'ostrowiec', 'ostrowwlkp', 'pila', 'pisz', 'podhale', 'podlasie', 'polkowice', 'pomorze', 'pomorskie', 'prochowice', 'pruszkow', 'przeworsk', 'pulawy', 'radom', 'rawa-maz', 'rybnik', 'rzeszow', 'sanok', 'sejny', 'siedlce', 'slask', 'slupsk', 'sosnowiec', 'stalowa-wola', 'skoczow', 'starachowice', 'stargard', 'suwalki', 'swidnica', 'swiebodzin', 'swinoujscie', 'szczecin', 'szczytno', 'tarnobrzeg', 'tgory', 'turek', 'tychy', 'ustka', 'walbrzych', 'warmia', 'warszawa', 'waw', 'wegrow', 'wielun', 'wlocl', 'wloclawek', 'wodzislaw', 'wolomin', 'wroclaw', 'zachpomor', 'zagan', 'zarow', 'zgora', 'zgorzelec', 'gda', 'gdansk', 'gdynia', 'med', 'sopot', 'gliwice', 'krakow', 'poznan', 'wroc', 'zakopane' ],


      pn: [ 'gov', 'co', 'org', 'edu', 'net' ],
      pr: [ 'com', 'net', 'org', 'gov', 'edu', 'isla', 'pro', 'biz', 'info', 'name', 'est', 'prof', 'ac' ],
      pro: [ 'aca', 'bar', 'cpa', 'jur', 'law', 'med', 'eng' ],
      ps: [ 'edu', 'gov', 'sec', 'plo', 'com', 'org', 'net' ],
      pt: [ 'net', 'gov', 'org', 'edu', 'int', 'publ', 'com', 'nome' ],
      pw: [ 'co', 'ne', 'or', 'ed', 'go', 'belau' ],
      qa: [ 'com', 'edu', 'gov', 'mil', 'name', 'net', 'org', 'sch' ],
      re: [ 'com', 'asso', 'nom' ],
      ro: [ 'com', 'org', 'tm', 'nt', 'nom', 'info', 'rec', 'arts', 'firm', 'store', 'www' ],
      rs: [ 'co', 'org', 'edu', 'ac', 'gov', 'in' ],


      ru: [ 'ac', 'com', 'edu', 'int', 'net', 'org', 'pp', 'adygeya', 'altai', 'amur', 'arkhangelsk', 'astrakhan', 'bashkiria', 'belgorod', 'bir', 'bryansk', 'buryatia', 'cbg', 'chel', 'chelyabinsk', 'chita', 'chukotka', 'chuvashia', 'dagestan', 'dudinka', 'e-burg', 'grozny', 'irkutsk', 'ivanovo', 'izhevsk', 'jar', 'joshkar-ola', 'kalmykia', 'kaluga', 'kamchatka', 'karelia', 'kazan', 'kchr', 'kemerovo', 'khabarovsk', 'khakassia', 'khv', 'kirov', 'koenig', 'komi', 'kostroma', 'krasnoyarsk', 'kuban', 'kurgan', 'kursk', 'lipetsk', 'magadan', 'mari', 'mari-el', 'marine', 'mordovia', 'mosreg', 'msk', 'murmansk', 'nalchik', 'nnov', 'nov', 'novosibirsk', 'nsk', 'omsk', 'orenburg', 'oryol', 'palana', 'penza', 'perm', 'pskov', 'ptz', 'rnd', 'ryazan', 'sakhalin', 'samara', 'saratov', 'simbirsk', 'smolensk', 'spb', 'stavropol', 'stv', 'surgut', 'tambov', 'tatarstan', 'tom', 'tomsk', 'tsaritsyn', 'tsk', 'tula', 'tuva', 'tver', 'tyumen', 'udm', 'udmurtia', 'ulan-ude', 'vladikavkaz', 'vladimir', 'vladivostok', 'volgograd', 'vologda', 'voronezh', 'vrn', 'vyatka', 'yakutia', 'yamal', 'yaroslavl', 'yekaterinburg', 'yuzhno-sakhalinsk', 'amursk', 'baikal', 'cmw', 'fareast', 'jamal', 'kms', 'k-uralsk', 'kustanai', 'kuzbass', 'magnitka', 'mytis', 'nakhodka', 'nkz', 'norilsk', 'oskol', 'pyatigorsk', 'rubtsovsk', 'snz', 'syzran', 'vdonsk', 'zgrad', 'gov', 'mil', 'test' ],


      rw: [ 'gov', 'net', 'edu', 'ac', 'com', 'co', 'int', 'mil', 'gouv' ],
      sa: [ 'com', 'net', 'org', 'gov', 'med', 'pub', 'edu', 'sch' ],
      sb: [ 'com', 'edu', 'gov', 'net', 'org' ],
      sc: [ 'com', 'gov', 'net', 'org', 'edu' ],
      sd: [ 'com', 'net', 'org', 'edu', 'med', 'gov', 'info' ],
      se: [ 'a', 'ac', 'b', 'bd', 'brand', 'c', 'd', 'e', 'f', 'fh', 'fhsk', 'fhv', 'g', 'h', 'i', 'k', 'komforb', 'kommunalforbund', 'komvux', 'l', 'lanbib', 'm', 'n', 'naturbruksgymn', 'o', 'org', 'p', 'parti', 'pp', 'press', 'r', 's', 'sshn', 't', 'tm', 'u', 'w', 'x', 'y', 'z' ],
      sg: [ 'com', 'edu', 'gov', 'net', 'org', 'per' ],
      sl: [ 'com', 'net', 'edu', 'gov', 'org' ],
      sn: [ 'art', 'com', 'edu', 'gouv', 'org', 'perso', 'univ' ],
      so: [ 'com', 'net', 'org' ],
      st: [ 'co', 'com', 'consulado', 'edu', 'embaixada', 'gov', 'mil', 'net', 'org', 'principe', 'saotome', 'store' ],
      sy: [ 'edu', 'gov', 'net', 'mil', 'com', 'org' ],
      sz: [ 'co', 'ac', 'org' ],
      th: [ 'ac', 'co', 'go', 'in', 'mi', 'net', 'or' ],
      tj: [ 'ac', 'biz', 'co', 'com', 'edu', 'go', 'gov', 'int', 'mil', 'name', 'net', 'nic', 'org', 'test', 'web' ],
      tl: [ 'gov' ],
      tn: [ 'com', 'ens', 'fin', 'gov', 'ind', 'intl', 'nat', 'net', 'org', 'info', 'perso', 'tourism', 'edunet', 'rnrt', 'rns', 'rnu', 'mincom', 'agrinet', 'defense', 'turen' ],
      to: [ 'com', 'gov', 'net', 'org', 'edu', 'mil' ],
      tt: [ 'co', 'com', 'org', 'net', 'biz', 'info', 'pro', 'int', 'coop', 'jobs', 'mobi', 'travel', 'museum', 'aero', 'name', 'gov', 'edu' ],
      tw: [ 'edu', 'gov', 'mil', 'com', 'net', 'org', 'idv', 'game', 'ebiz', 'club' ],
      tz: [ 'ac', 'co', 'go', 'mil', 'ne', 'or', 'sc' ],
      ua: [ 'com', 'edu', 'gov', 'in', 'net', 'org', 'cherkassy', 'chernigov', 'chernovtsy', 'ck', 'cn', 'crimea', 'cv', 'dn', 'dnepropetrovsk', 'donetsk', 'dp', 'if', 'ivano-frankivsk', 'kh', 'kharkov', 'kherson', 'khmelnitskiy', 'kiev', 'kirovograd', 'km', 'kr', 'ks', 'kv', 'lg', 'lugansk', 'lutsk', 'lviv', 'mk', 'nikolaev', 'od', 'odessa', 'pl', 'poltava', 'rovno', 'rv', 'sebastopol', 'sumy', 'te', 'ternopil', 'uzhgorod', 'vinnica', 'vn', 'zaporizhzhe', 'zp', 'zhitomir', 'zt', 'co', 'pp' ],
      ug: [ 'co', 'ac', 'sc', 'go', 'ne', 'or' ],
      us: [ 'dni', 'fed', 'isa', 'kids', 'nsn', 'ak', 'al', 'ar', 'as', 'az', 'ca', 'co', 'ct', 'dc', 'de', 'fl', 'ga', 'gu', 'hi', 'ia', 'id', 'il', 'in', 'ks', 'ky', 'la', 'ma', 'md', 'me', 'mi', 'mn', 'mo', 'ms', 'mt', 'nc', 'nd', 'ne', 'nh', 'nj', 'nm', 'nv', 'ny', 'oh', 'ok', 'or', 'pa', 'pr', 'ri', 'sc', 'sd', 'tn', 'tx', 'ut', 'vi', 'vt', 'va', 'wa', 'wi', 'wv', 'wy' ],
      uz: [ 'com', 'co' ],
      vc: [ 'com', 'net', 'org', 'gov', 'mil', 'edu' ],
      vi: [ 'co', 'com', 'k12', 'net', 'org' ],
      vn: [ 'com', 'net', 'org', 'edu', 'gov', 'int', 'ac', 'biz', 'info', 'name', 'pro', 'health' ],
      ws: [ 'com', 'net', 'org', 'gov', 'edu' ],
      at: [ 'biz', 'info', 'priv' ],
      ca: [ 'co' ],
      com: [ 'ar', 'br', 'cn', 'de', 'eu', 'gb', 'gr', 'hu', 'jpn', 'kr', 'no', 'qc', 'ru', 'sa', 'se', 'uk', 'us', 'uy', 'za' ],
      net: [ 'gb', 'jp', 'se', 'uk', 'za' ],
      org: [ 'ae', 'us', 'za' ],
      de: [ 'com' ],


      // !! IGNORED -
      // !!  operaunite.com, appspot.com


      fi: [ 'iki' ],
      la: [ 'c' ],
      uk: [ 'ac', 'co', 'gov', 'judiciary', 'ltd', 'me', 'mod', 'net', 'nhs', 'nic', 'org', 'parliament', 'plc', 'police', 'sch' ]
        // !!--> from http://en.wikipedia.org/wiki/.uk


      // !! NOTE ARGH, give up on DynDNS.com domain names (see mozilla list) for now.... You should hopefully know what you're doing!!!
    }

    if ((tld in SLDs) && -1 != SLDs[tld].indexOf(labels[len - 2]))
      return {
        name: labels.splice(-3).join('.'),
        host: host
      };
    else
      return {
        name: labels.splice(-2).join('.'),
        host: host
      };

/* TODO - third and *FOURTH* (gasp!) level domains!!!
act	edu.au
nsw	edu.au
nt	edu.au
qld	edu.au
sa	edu.au
tas	edu.au
vic	edu.au
wa	edu.au
act	gov.au
nt	gov.au
qld	gov.au
sa	gov.au
tas	gov.au
vic	gov.au
wa	gov.au

ltd	co.im
plc	co.im


nes	akershus.no
nes	buskerud.no
os	hedmark.no
os	hordaland.no
gs	aa.no
gs	ah.no
gs	bu.no
gs	fm.no
gs	hl.no
gs	hm.no
gs	jan-mayen.no
gs	mr.no
gs	nl.no
gs	nt.no
gs	of.no
gs	ol.no
gs	oslo.no
gs	rl.no
gs	sf.no
gs	st.no
gs	svalbard.no
gs	tm.no
gs	tr.no
gs	va.no
gs	vf.no
bo	telemark.no
bø	telemark.no
bo	nordland.no
bø	nordland.no
heroy	more-og-romsdal.no
herøy	møre-og-romsdal.no
heroy	nordland.no
herøy	nordland.no
sande	more-og-romsdal.no
sande	møre-og-romsdal.no
sande	vestfold.no
valer	ostfold.no
våler	østfold.no
valer	hedmark.no
våler	hedmark.no


uw	gov.pl
um	gov.pl
ug	gov.pl
upow	gov.pl
starostwo	gov.pl
so	gov.pl
sr	gov.pl
po	gov.pl
pa	gov.pl


gov	nc.tr


k12	ak.us
k12	al.us
k12	ar.us
k12	as.us
k12	az.us
k12	ca.us
k12	co.us
k12	ct.us
k12	dc.us
k12	de.us
k12	fl.us
k12	ga.us
k12	gu.us
k12	ia.us
k12	id.us
k12	il.us
k12	in.us
k12	ks.us
k12	ky.us
k12	la.us
k12	ma.us
k12	md.us
k12	me.us
k12	mi.us
k12	mn.us
k12	mo.us
k12	ms.us
k12	mt.us
k12	nc.us
k12	nd.us
k12	ne.us
k12	nh.us
k12	nj.us
k12	nm.us
k12	nv.us
k12	ny.us
k12	oh.us
k12	ok.us
k12	or.us
k12	pa.us
k12	pr.us
k12	ri.us
k12	sc.us
k12	sd.us
k12	tn.us
k12	tx.us
k12	ut.us
k12	vi.us
k12	vt.us
k12	va.us
k12	wa.us
k12	wi.us
k12	wv.us
k12	wy.us
cc	ak.us
cc	al.us
cc	ar.us
cc	as.us
cc	az.us
cc	ca.us
cc	co.us
cc	ct.us
cc	dc.us
cc	de.us
cc	fl.us
cc	ga.us
cc	gu.us
cc	hi.us
cc	ia.us
cc	id.us
cc	il.us
cc	in.us
cc	ks.us
cc	ky.us
cc	la.us
cc	ma.us
cc	md.us
cc	me.us
cc	mi.us
cc	mn.us
cc	mo.us
cc	ms.us
cc	mt.us
cc	nc.us
cc	nd.us
cc	ne.us
cc	nh.us
cc	nj.us
cc	nm.us
cc	nv.us
cc	ny.us
cc	oh.us
cc	ok.us
cc	or.us
cc	pa.us
cc	pr.us
cc	ri.us
cc	sc.us
cc	sd.us
cc	tn.us
cc	tx.us
cc	ut.us
cc	vi.us
cc	vt.us
cc	va.us
cc	wa.us
cc	wi.us
cc	wv.us
cc	wy.us
lib	ak.us
lib	al.us
lib	ar.us
lib	as.us
lib	az.us
lib	ca.us
lib	co.us
lib	ct.us
lib	dc.us
lib	de.us
lib	fl.us
lib	ga.us
lib	gu.us
lib	hi.us
lib	ia.us
lib	id.us
lib	il.us
lib	in.us
lib	ks.us
lib	ky.us
lib	la.us
lib	ma.us
lib	md.us
lib	me.us
lib	mi.us
lib	mn.us
lib	mo.us
lib	ms.us
lib	mt.us
lib	nc.us
lib	nd.us
lib	ne.us
lib	nh.us
lib	nj.us
lib	nm.us
lib	nv.us
lib	ny.us
lib	oh.us
lib	ok.us
lib	or.us
lib	pa.us
lib	pr.us
lib	ri.us
lib	sc.us
lib	sd.us
lib	tn.us
lib	tx.us
lib	ut.us
lib	vi.us
lib	vt.us
lib	va.us
lib	wa.us
lib	wi.us
lib	wv.us
lib	wy.us
pvt	k12.ma.us
chtr	k12.ma.us
paroch	k12.ma.us
*/


  }
  else
      // IP addresses should't be munged.
    return {
      name: host,
      host: host
    };
}

/* Constants. */
var extension = chrome.extension;
var sendRequest = extension.sendRequest;
var anchor = document.createElement('a');
var animate = true;

/*
  Raises tracking requests. We define a tracking request broadly because there
  are many ways to track besides cookies (IP addresses, LSOs, browser
  fingerprinting, to name a few) and we don't bug the user with sound effects.
*/
sendRequest({initialized: true}, function(response) {
  var extensionId = getDomain(extension.getURL('')).name;
  var referrerDomain = getDomain(response.referrerUrl);
  var referrerName = referrerDomain.name;
  var referrerHost = referrerDomain.host;

  document.addEventListener('beforeload', function(event) {
    var domain = getDomain(event.url);
    var name = domain.name;
    name && name != extensionId && name != referrerName &&
        sendRequest({
          domain: {name: name, host: domain.host},
          referrerDomain: {name: referrerName, host: referrerHost},
          type: event.target.nodeName.toLowerCase(),
          animate: animate && !(animate = false)
        });
  }, true);
});
