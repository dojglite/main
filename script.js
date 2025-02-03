const romajiToJapaneseMap = {
    "ageru1": "あげる(1)",
    "ageru2": "あげる(2)",
    "aidani": "間・あいだ(に)",
    "amari1": "あまり",
    "aru1": "ある(1)",
    "aru2": "ある(2)",
    "atode": "あとで",
    "ba": "ば",
    "bakari": "ばかり",
    "bayokatta": "ばよかった",
    "dai": "だい",
    "dake": "だけ",
    "dakedenaku": "だけで(は)なく～(も)",
    "darou": "だろう",
    "dasu": "出す・だす",
    "de1": "で(1)",
    "de2": "で(2)",
    "de3": "で(3)",
    "de4": "で(4)",
    "demo": "でも",
    "dou": "どう",
    "he": "へ",
    "ga1": "が(1)",
    "ga2": "が(2)",
    "garu": "がる",
    "goro": "ごろ",
    "gotoni": "ごとに",
    "hajimeru": "始める・はじめる",
    "hazu": "はず",
    "hodo": "ほど",
    "hougaii": "ほうがいい",
    "hougayori": "ほうが~より",
    "hoshii1": "欲しい・ほしい(1)",
    "hoshii2": "欲しい・ほしい(2)",
    "ichiban": "一番・いちばん",
    "iku1": "行く・いく(1)",
    "iku2": "行く・いく(2)",
    "iru1": "いる(1)",
    "iru2": "いる(2)",
    "iru3": "要る・いる(3)",
    "jibun1": "自分・じぶん(1)",
    "jibun2": "自分・じぶん(2)",
    "ka1": "か(1)",
    "ka2": "か(2)",
    "kadouka": "か(どうか)",
    "kai": "かい",
    "kamoshirenai": "かもしれない",
    "kara1": "から(1)",
    "kara2": "から(2)",
    "kara3": "から(3)",
    "kashira": "かしら",
    "kata": "方・かた",
    "kawarini": "代わりに・かわりに",
    "keredomo": "けれども",
    "kikoeru": "聞こえる・きこえる",
    "kiraida": "嫌いだ・きらいだ",
    "koto1": "こと(1)",
    "koto2": "こと(2)",
    "kotogaaru1": "ことがある(1)",
    "kotogaaru2": "ことがある(2)",
    "kotodekiru": "ことが出来る・できる",
    "kotoninaru": "ことになる",
    "kotonisuru": "ことにする",
    "kotoha": "ことは",
    "kudasai": "下さい・ください",
    "kun": "君・くん",
    "kurai": "くらい",
    "kureru1": "呉れる・くれる(1)",
    "kureru2": "呉れる・くれる(2)",
    "kuru1": "来る・くる(1)",
    "kuru2": "来る・くる(2)",
    "mada": "まだ",
    "made": "まで",
    "madeni": "までに",
    "maeni": "前に・まえに",
    "mai": "毎・まい",
    "mama": "まま",
    "mashou": "ましょう",
    "mieru": "見える・みえる",
    "miru": "みる",
    "mo1": "も",
    "mo2": "も(2)",
    "mou": "もう",
    "momo": "も~も",
    "monoda": "もの(だ)",
    "morau1": "もらう(1)",
    "morau2": "もらう(2)",
    "na": "な",
    "nado": "など",
    "nagara": "ながら",
    "naide": "ないで",
    "nakerebanaranai": "なければならない",
    "nakunaru": "なくなる",
    "nakute": "なくて",
    "nara": "なら",
    "nasai": "なさい",
    "ne": "ね",
    "ni1": "に(1)",
    "ni2": "に(2)",
    "ni3": "に(3)",
    "ni4": "に(4)",
    "ni5": "に(5)",
    "ni6": "に(6)",
    "ni7": "に(7)",
    "nichigainai": "に違いない・にちがいない",
    "nikui": "難い・にくい",
    "nishiteha": "にしては",
    "nisuru": "にする",
    "no1": "の(1)",
    "no2": "の(2)",
    "no3": "の(3)",
    "no4": "の(4)",
    "noda": "のだ",
    "node": "ので",
    "noni1": "のに(1)",
    "noni2": "のに(2)",
    "nohada": "のは～だ",
    "o": "お",
    "wo1": "を(1)",
    "wo2": "を(2)",
    "wo3": "を(3)",
    "wo4": "を(4)",
    "ooi": "多い・おおい",
    "oku": "おく",
    "oninaru": "お～になる",
    "osuru": "お～する",
    "owaru": "終わる・おわる",
    "rareru1": "られる(1)",
    "rareru2": "られる(2)",
    "rashii": "らしい",
    "relativeclause1": "Relative Clause",
    "sa": "さ",
    "sama": "様・さま",
    "saseru": "させる",
    "sekkaku": "せっかく",
    "shi": "し",
    "shii": "しい",
    "shika": "しか",
    "shimau": "しまう",
    "shiru": "知る・しる",
    "souda1": "そうだ(1)",
    "souda2": "そうだ(2)",
    "sorede": "それで",
    "soredeha": "それでは",
    "sorekara": "それから",
    "sorenara": "それなら",
    "soretomo": "それとも",
    "soshite": "そして",
    "sugiru": "過ぎる・すぎる",
    "sukida": "好きだ・すきだ",
    "sukunai": "少ない・すくない",
    "suru1": "する(1)",
    "suru2": "する(2)",
    "suru3": "する(3)",
    "suru4": "する(4)",
    "suruto": "すると",
    "tai": "たい",
    "tamaranai": "堪らない・たまらない",
    "tameni": "為(に)・ため(に)",
    "tara": "たら",
    "taradoudesuka": "たらどうですか",
    "taritarisuru": "たり～たりする",
    "tatte": "たって",
    "te": "て",
    "temo": "ても",
    "temoii": "てもいい",
    "to1": "と(1)",
    "to2": "と(2)",
    "to3": "と(3)",
    "to4": "と(4)",
    "toieba": "と言えば",
    "toiu": "という",
    "toka": "とか",
    "toki": "時・とき",
    "tokoroda1": "ところだ(1)",
    "tokoroda2": "ところだ(2)",
    "toshite": "として",
    "toshiteha": "としては",
    "tsumori": "つもり",
    "tte1": "って(1)",
    "tte2": "って(2)",
    "uchini": "うちに",
    "wa1": "は(1)",
    "wa2": "わ(2)",
    "wada": "は～だ",
    "waga": "は～が",
    "waikenai": "はいけない",
    "wakaru": "分かる・わかる",
    "wakeda": "わけだ",
    "ya1": "屋・や",
    "ya2": "や",
    "yahari": "やはり",
    "yasui": "易い・やすい",
    "youda": "ようだ",
    "youni1": "ように(1)",
    "youni2": "ように(2)",
    "youniiu": "ように言う",
    "youninaru": "ようになる",
    "younisuru": "ようにする",
    "yori1": "より(1)",
    "yori2": "より(2)",
    "youtoomou": "ようと思う",
    "zutsu": "ずつ",
    "amari2": "あまり",
    "bahodo": "~ば~ほど",
    "bakarika": "~ばかりか~(さえ)",
    "bekida": "べきだ",
    "bun": "分",
    "daga": "だが",
    "dakaratoitte": "だからと言って",
    "dakede": "だけで",
    "darake": "だらけ",
    "de5": "で",
    "dearo": "であろう",
    "dearu": "である",
    "dokoroka": "どころか",
    "doumo": "どうも",
    "donnanikotoka": "どんなに~(こと)か",
    "douse": "どうせ",
    "fuuni": "風に",
    "gachi": "がち",
    "gatai": "がたい",
    "gyakuni": "逆に",
    "hodo2": "ほど",
    "igai": "以外",
    "ijouwa": "以上(は)",
    "ikani": "いかにも",
    "imperative": "Imperative",
    "ippoudehahoudeha": "一方で(は)他方で(は)",
    "jou": "上",
    "kaette": "かえって",
    "kagiri1": "限り",
    "kagiri2": "限り(2)",
    "kaka": "か~か",
    "kana2": "かな",
    "kanarazushimo": "必ずしも",
    "kaneru": "かねる",
    "karanitarumade": "から~に至るまで",
    "karanikakete": "から~にかけて",
    "karatoitte": "からと言って",
    "karou": "かろう",
    "katasuru": "方をする",
    "katoiuto": "かと言うと",
    "kawarini2": "(の)代わりに",
    "kekka": "結果",
    "kekkou": "結構",
    "kono": "この",
    "koushita": "こうした",
    "koso": "こそ",
    "koto3": "こと",
    "kotode": "ことで",
    "kotonaru2": "ことになる",
    "kotoniyoru": "ことによる",
    "kotowanai": "ことはない",
    "ku": "く",
    "kurai2": "くらい",
    "kuseni": "くせに",
    "mademonai": "までもない",
    "mai2": "まい",
    "masaka": "まさか",
    "mashida": "ましだ",
    "mataha": "または",
    "me": "目",
    "men": "面",
    "miseru": "みせる",
    "mo3": "も",
    "moba": "も~ば",
    "momo2": "も~も",
    "monoda2": "もの(だ)",
    "naa": "なあ",
    "nadoto": "などと",
    "nagaramo": "ながら(も)",
    "naikomohanai": "ないことも/はない",
    "nakanaka": "なかなか",
    "naku": "なく",
    "nandemo": "何でも",
    "nanishiro": "何しろ",
    "naranai": "ならない",
    "narinari": "なり~なり",
    "narini": "なりに",
    "nashideha": "なしでは",
    "nebanaranai": "ねばならない",
    "ni8": "に",
    "niatatte": "に当たって/当たり",
    "nihanteshi": "に反して/反する",
    "nihokanara": "にほかならない",
    "nikagiradzu": "に限らず",
    "nikagitte": "に限って",
    "nikanshite": "に関して/関する",
    "nikawatte": "に代わって",
    "nikuraberu": "に比べると/比べて",
    "nimokakawara": "にもかかわらず",
    "nimotoduite": "に基づいて/基づく",
    "ninaruto": "になると",
    "nioite": "において/おける",
    "nishitagatte": "に従って/従い",
    "nisuginai": "に過ぎない",
    "nitaishite": "に対して/対する",
    "nitotte": "にとって",
    "nitsuite": "について",
    "nitsuki": "につき",
    "nitsurete": "につれて/つれ",
    "niwa": "には",
    "niyotte": "によって/より",
    "nokankeide": "の関係で",
    "nokoto": "のこと",
    "nokotodakara": "のことだから",
    "nomi": "のみ",
    "noshitade": "の下で",
    "nouedeha": "の上では",
    "nowakotoda": "のは~のことだ",
    "nu": "ぬ",
    "oda": "お~だ",
    "ohajime": "をはじめ(として)",
    "okudasai": "お~下さい",
    "omowareru": "思われる",
    "ori": "おり",
    "otsushite": "を通して",
    "ppanashi": "っぱなし",
    "ppoi": "っぽい",
    "rai": "来",
    "reino": "例の",
    "relativeclause2": "Relative Clause",
    "rhetoricalq": "Rhetorical Question",
    "rokuninai": "ろくに~ない",
    "sa2": "さ",
    "sae": "さえ",
    "saini": "際(に)",
    "sasuga": "さすが",
    "sei": "せい",
    "semete": "せめて",
    "shidai": "次第",
    "shikamo": "しかも",
    "shitagatte": "したがって",
    "soukatoitte": "そうかと言って",
    "sokode": "そこで",
    "sokode2": "そこで(2)",
    "sokoo": "そこを",
    "souninaru": "そうになる",
    "sonoue": "その上",
    "soredemo": "それでも",
    "soredokoroka": "それどころか",
    "sorega": "それが",
    "soremo": "それも",
    "soreni": "それに",
    "soreto": "それと",
    "soreha": "それは",
    "sorezore": "それぞれ",
    "sugu": "すぐ",
    "tabini": "たびに",
    "tada": "ただ",
    "tadano": "ただの",
    "tashikaniga": "確かに~が",
    "tatokorode": "たところで",
    "te2": "て",
    "tehajimete": "て初めて",
    "tende": "点(で)",
    "teha": "ては",
    "to5": "と",
    "todoujini": "と同時に",
    "toittemo": "と言っても",
    "toiufuuni": "という風に",
    "toiukotoha": "ということは",
    "toiunoni": "というのに",
    "toiunoha": "というのは~ことだ",
    "toiuto": "と言うと",
    "toiuyoriha": "というより(は)",
    "tokade": "とかで",
    "tokoro": "ところ",
    "tokoroga": "ところが",
    "tomo": "とも",
    "tonaru": "となる",
    "tonaruto": "となると",
    "toorini": "通り(に)",
    "tosuru1": "とする(1)",
    "tosuru2": "とする(2)",
    "totan": "途端(に)",
    "toutou": "とうとう",
    "totomoni": "と共に",
    "tohakagiranai": "とは限らない",
    "tsumari": "つまり",
    "tsutsu": "つつ",
    "uede": "(の)上で",
    "ueni": "上(に)",
    "uru": "得る　(うる・える)",
    "vmasu": "Vmasu",
    "vmasunoun": "Vmasu as a Noun",
    "wa3": "は",
    "waiumadememonaku": "は言うまでもなく",
    "wakeda2": "わけだ",
    "wakedehanai": "わけではない",
    "wakeganai": "わけがない",
    "wakenihaikanai": "わけにはいかない",
    "yaru1": "やる(1)",
    "yaru2": "やる(2)",
    "yatto": "やっと",
    "you1": "よう(1)",
    "you2": "よう(2)",
    "yori3": "より",
    "zaruwoenai": "ざるを得ない",
    "zo": "ぞ",
    "aete": "あえて",
    "agekuni": "あげく(に)",
    "akumademo": "あくまでも",
    "anagachinai": "あながち～ない",
    "aruiha": "あるいは",
    "atakamo": "あたかも",
    "bakarini": "ばかりに",
    "bakoso": "ばこそ",
    "bekarazu": "べからず・べからざる",
    "beku": "べく",
    "bekumonai": "べくもない",
    "bekushite": "べくして",
    "chinamini": "ちなみに",
    "dake2": "だけ",
    "dakeatte": "だけあって",
    "dakeni": "だけに",
    "dakenokotohaaru": "だけのことはある",
    "dani": "だに",
    "dano": "だの",
    "datte1": "だって(1)",
    "datte2": "だって(2)",
    "deare": "であれ",
    "dearedeare": "～であれ～であれ",
    "demojaarumaishi": "でも・じゃあるまいし",
    "demowhdemo": "～でも[Wh. word]でも",
    "dochirakatoiuto": "どちらかと言うと",
    "douka": "どうか",
    "dokorodehanai": "どころではない",
    "domo": "ども",
    "dounimonai": "どうにも～ない",
    "doushi": "同士",
    "gahayaika": "が早いか",
    "ganara": "～が～なら",
    "gotoshi": "ごとし",
    "hanmen": "反面",
    "hatashite": "はたして",
    "hiiteha": "ひいては",
    "hitotoshitenai": "一[Counter]として～ない",
    "hitotsu": "ひとつ",
    "hitotsuni": "一つには",
    "ichiou": "一応",
    "ikanda": "如何(だ)",
    "ikanaru": "いかなる",
    "ikani2": "いかに",
    "ikura": "いくら",
    "imasara": "今更",
    "ippouda": "一方(だ)",
    "ippoude": "一方(で)",
    "irai": "以来",
    "issainai": "一切～ない",
    "ittan": "一旦",
    "ittemireba": "言ってみれば",
    "iumademonai": "言うまでもない",
    "iwaba": "言わば",
    "iwayuru": "いわゆる",
    "jitai": "自体",
    "kagirida": "限りだ",
    "kai2": "甲斐",
    "kainaya": "か否か",
    "kana3": "かな",
    "kanoyouni": "かのように",
    "karaiette": "から言って",
    "karanaru": "からなる",
    "karaniha": "からには",
    "karashite": "からして",
    "karini": "仮に",
    "katoomou": "かと思うと",
    "katsu": "且つ・かつ",
    "kiraigaaru": "きらいがある",
    "kkiri": "(っ)きり",
    "kke": "っけ",
    "konouenai": "この上ない",
    "kotoka": "ことか",
    "kotokara": "ことから",
    "kotoni": "ことに",
    "kuwaete": "加えて",
    "madenokotoda": "まで(のこと)だ",
    "mashiteya": "まして(や)",
    "mata": "また",
    "mettaninai": "滅多に～ない",
    "mirukarani": "見るからに",
    "movba": "～も[V]ば～も[V]",
    "monodehanai": "ものではない",
    "monoka1": "ものか(1)",
    "monoka2": "ものか(2)",
    "mononara": "ものなら",
    "monono": "ものの",
    "monoo": "ものを",
    "mosarukotonagara": "もさることながら",
    "moshikuha": "もしくは",
    "mottomo": "もっとも",
    "muke": "向け",
    "mushiro": "むしろ",
    "naidehanai": "ないでもない",
    "naikotoniha": "ないことには",
    "naimademo": "ないまでも",
    "naishi": "ないし(は)",
    "nakao": "中を",
    "nakushite": "なくして(は)",
    "namaji": "なまじ(っか)",
    "nami": "並み",
    "nannumberumo": "何[(Number)+Counter]も",
    "nanai": "何～ない",
    "nanimonai": "何も～ない",
    "nanrakano": "何らかの",
    "naranai2": "何ら～ない",
    "nante1": "なんて(1)",
    "nante2": "なんて(2)",
    "nantoka": "何とか",
    "nao": "なお",
    "naosara": "なおさら",
    "naradeha": "ならでは(の)",
    "narabini": "並びに",
    "nari2": "なり",
    "naruhodo": "なるほど",
    "nashini": "なしに",
    "nasu": "なす",
    "nazeka": "なぜか",
    "nazenaraba": "なぜなら(ば)～からだ",
    "nbakari": "んばかり(に)",
    "negau": "願う・願います",
    "nihikikae": "にひきかえ",
    "niitatte": "にいたっては",
    "nikankakawarazu": "に関・拘・係わらず",
    "nikakete": "にかけては",
    "ninkukunai": "に難くない",
    "nikimatte": "に決まっている",
    "nikoshita": "に越したことはない",
    "nitomonaruto": "に・ともなると",
    "nimukete": "に向けて・に向けた",
    "ninai": "～に～ない",
    "nimonaku": "に(も)なく",
    "niojite": "に応じて・応じて",
    "nishiro": "にしろ・せよ",
    "nishita": "にしたところで",
    "nishite1": "にして(1)",
    "nishite2": "にして(2)",
    "nishitekaraga": "にしてからが",
    "nishitemo": "にしても",
    "nitodomara": "にとどまらず",
    "nitsuke": "につけ",
    "niwatatte": "にわたって・わたる",
    "niyorazu": "によらず",
    "niyoruto": "によると",
    "nominarazu": "のみならず",
    "nonannotte": "のなんのって",
    "nonasa": "の無さ",
    "nonoto": "～の～のと",
    "ntosuru": "んとする",
    "ochushini": "を中心に",
    "okaishite": "を介して/介した",
    "okinjienai": "を禁じ得ない",
    "omegutte": "をめぐって・めぐる",
    "omoeba": "思えば",
    "omonotomo": "をものともせず",
    "omouni": "思うに",
    "ooitehokanai": "をおいてほかに(は)～ない",
    "orini": "折(に)",
    "osorearu": "恐れがある",
    "otowazu": "を問わず",
    "oyobi": "及び",
    "oyoso": "およそ",
    "oyosoni": "をよそに",
    "samo": "さも",
    "sarani": "更に",
    "sate": "さて",
    "sazo": "さぞ(かし)",
    "somosomo": "そもそも(の)",
    "sonomono": "そのもの",
    "soredake": "それだけ",
    "sorenarini": "それなりに・の",
    "sueni": "末(に)",
    "sumu": "済む",
    "tada2": "ただ",
    "tadashi": "但し",
    "takaga": "たかが",
    "tanaride": "たなり(で)",
    "tanide": "単位で",
    "tanni": "単に",
    "taruya": "たるや",
    "ttatte1": "(っ)たって(1)",
    "ttatte2": "(っ)たって(2)",
    "tebakarihaikenai": "てばかりはいられない",
    "temotemo": "～ても～ても",
    "teshikatanai": "て仕方がない",
    "tehaikenai": "てはいられない",
    "toatte": "とあって",
    "toatteha": "とあっては",
    "tobakarini": "とばかりに",
    "todemoyoubeki": "とでも言うべき",
    "toiedomo": "といえども",
    "toiitoii": "～といい～といい",
    "toitta": "といった",
    "toittatokoroda": "といったところだ",
    "toitte": "と言って",
    "toiuka": "と言うか",
    "toiunoha2": "と言うのは",
    "toiwazutoiwazu": "と言わず~と言わず",
    "tokorokara": "ところから",
    "tomonaku": "ともなく",
    "tomosuruto": "ともすると",
    "tono": "との",
    "totemonai": "とても～ない",
    "toha": "とは",
    "tohaie": "とは言え",
    "tsui": "つい",
    "tsuideni": "ついでに",
    "tsuite": "ついては",
    "ttaranai": "(と言)ったらない",
    "haare": "はあれ",
    "habetoshite": "は別として",
    "haiioshitemo": "はいいとしても",
    "haoroka": "はおろか",
    "wariniha": "割に(は)",
    "wawa": "～わ～わ",
    "yainaya": "や否や・やいなや",
    "yara": "やら",
    "yarayara": "～やら～やら",
    "youdewa": "ようでは",
    "youmononara": "ようものなら",
    "younimonai": "ようにも(～ない)",
    "yorihokanai": "より・のほか(に)(は)～ない",
    "yu": "由",
    "youto": "ようと・が",
    "yueni": "故に",
    "zunihaokana": "ずにはおかない",
    "zushite": "ずして",
    "zutomo": "ずとも"
}

// DOM Elements (Cached for performance)
const progressBar = document.getElementById('progressBar');
const completedCount = document.getElementById('completed');
const totalCount = document.getElementById('total');
const progressCounter = document.getElementById('progress-counter');
const searchModal = document.getElementById('searchModal');
const searchInput = document.getElementById('searchInput');
const searchInputContainer = document.getElementById('searchInputContainer');
const searchResults = document.getElementById('searchResults');
const confirmationModal = document.getElementById('confirmationModal');
const confirmYesBtn = confirmationModal.querySelector('.confirm-yes');
const confirmNoBtn = confirmationModal.querySelector('.confirm-no');
const helpModal = document.getElementById('helpModal');
const helpCloseBtn = helpModal.querySelector('.help-close-btn');
let selectedResultIndex = -1;
let isArrowKeyHeld = false;
let arrowKeyHoldTimeout;
let isMouseMoving = false;
let mouseTimeout;
const CONFIG = {
    ANIMATION: {
        DURATION: 200,
        HIGHLIGHT_TIMEOUT: 7000,
        PROGRESS_STEP: 0.006,
        CIRCLE_CIRCUMFERENCE: 62.83
    },
    SEARCH: {
        DEBOUNCE_MS: 100
    }
};

// --- Progress Bar and Counter Functions ---
function animateProgressBar(progress) {
    progressBar.style.width = `${progress}%`;
    progressBar.classList.toggle('complete', progress === 100);
    if (progress === 100) {
        progressBar.style.transform = 'scaleY(1.15)';
        setTimeout(() => progressBar.style.transform = 'scaleY(1)', CONFIG.ANIMATION.DURATION);
    }
}

function updateProgressText(checkedCount, total) {
    completedCount.textContent = checkedCount;
    totalCount.textContent = total;
}

function calculateProgress() {
    // Instead of querying all checkboxes again, collect from column caches
    const allCheckboxes = Array.from(document.querySelectorAll('.column'))
        .flatMap(column => column.checkboxCache);
    let checkedCount = 0;
    const total = allCheckboxes.length;

    for (let i = 0; i < total; i++) {
        if (allCheckboxes[i].checked) {
            checkedCount++;
        }
    }

    const progress = (total === 0) ? 0 : (checkedCount / total) * 100; // Prevent division by zero if no checkboxes
    return { checkedCount, total, progress };
}

function updateProgressBar() {
    const { checkedCount, total, progress } = calculateProgress();
    animateProgressBar(progress);
    updateProgressText(checkedCount, total);

    const percentage = document.getElementById('progressPercentage');
    if (percentage) { 
        percentage.textContent = `${checkedCount === total ? 100 : Math.floor(progress)}%`;
    }

    
}
// --- Smooth Scroll Function ---
function smoothScrollToAnchor(anchor) {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    });
}

// --- Checkbox State Management Functions ---
function saveCheckboxState(checkbox) {
    localStorage.setItem(checkbox.id, checkbox.checked);
}

function loadCheckboxState(checkbox) {
    checkbox.checked = localStorage.getItem(checkbox.id) === 'true';
}

function updateCheckAllButtonState(column) {
    if (!column) return;
    const checkboxesInColumn = column.checkboxCache; // Use the cached checkboxes
    const checkAllBtn = column.querySelector('.check-all-btn');
    const progressCircle = checkAllBtn.querySelector('.progress-circle');
    const allCheckedInColumn = checkboxesInColumn.every(cb => cb.checked); // Use the cached array

    if (allCheckedInColumn) {
        checkAllBtn.classList.add('checked');
        checkAllBtn.classList.remove('unchecked');
    } else {
        checkAllBtn.classList.remove('checked');
        checkAllBtn.classList.add('unchecked');
        progressCircle.style.strokeDashoffset = CONFIG.ANIMATION.CIRCLE_CIRCUMFERENCE;
    }
}

function handleCheckboxChange(checkbox) {
    saveCheckboxState(checkbox);
    updateProgressBar();
    const column = checkbox.closest('.column');
    updateCheckAllButtonState(column);
}

// --- Check All Button Functions ---
function startCheckingAnimation(checkAllBtn) {
    checkAllBtn.classList.add('checking');
    checkAllBtn.classList.remove('checked', 'unchecked', 'pop', 'reverse-pop');
    const progressCircle = checkAllBtn.querySelector('.progress-circle');
    progressCircle.style.transition = 'none';
    progressCircle.style.strokeDashoffset = CONFIG.ANIMATION.CIRCLE_CIRCUMFERENCE;
    void progressCircle.offsetWidth; // Force reflow
    progressCircle.style.transition = 'stroke-dashoffset 0.04s linear';
    animateCheckAllProgress(checkAllBtn, 0);
}

function animateCheckAllProgress(checkAllBtn, progress) {
    if (!checkAllBtn.classList.contains('checking')) return;
    const progressCircle = checkAllBtn.querySelector('.progress-circle');
    const initialOffset = CONFIG.ANIMATION.CIRCLE_CIRCUMFERENCE;
    const newOffset = initialOffset * (1 - progress);
    progressCircle.style.strokeDashoffset = newOffset;

    if (progress < 1) {
        requestAnimationFrame(() => animateCheckAllProgress(checkAllBtn, progress + CONFIG.ANIMATION.PROGRESS_STEP)); 
    } else {
        completeCheckingAnimation(checkAllBtn);
    }
}

function updateCheckboxesAndState(column, shouldCheck) {
    const checkboxes = column.checkboxCache; // Use cached checkboxes
    const updates = [];
    checkboxes.forEach(checkbox => {
        if (checkbox.checked !== shouldCheck) { // Only update if state needs to change
            checkbox.checked = shouldCheck;
            updates.push({ checkboxId: checkbox.id, checked: shouldCheck });
        }
    });

    requestAnimationFrame(() => {
        updates.forEach(update => {
            saveCheckboxState({ id: update.checkboxId, checked: update.checked });
        });
        updateProgressBar();
        updateCheckAllButtonState(column);
    });
    localStorage.setItem(`checkAllState-${column.id}`, shouldCheck ? 'checked' : 'unchecked');
}

function completeCheckingAnimation(checkAllBtn) {
    checkAllBtn.classList.remove('checking');
    checkAllBtn.classList.add('checked', 'pop');
    const column = checkAllBtn.closest('.column');
    updateCheckboxesAndState(column, true); // Call common function to CHECK checkboxes
    // localStorage.setItem(`checkAllState-${column.id}`, 'checked'); // Now handled in updateCheckboxesAndState
}

function cancelCheckingAnimation(checkAllBtn) {
    checkAllBtn.classList.remove('checking');
    const progressCircle = checkAllBtn.querySelector('.progress-circle');
    progressCircle.style.transition = 'none';
    progressCircle.style.strokeDashoffset = CONFIG.ANIMATION.CIRCLE_CIRCUMFERENCE;
    void progressCircle.offsetWidth;
    progressCircle.style.transition = '';

    const column = checkAllBtn.closest('.column');
    updateCheckboxesAndState(column, false); // Call common function to UNCHECK checkboxes
    // localStorage.setItem(`checkAllState-${column.id}`, 'unchecked'); // Now handled in updateCheckboxesAndState
}

function handleCheckAllButtonClick(checkAllBtn) {
    const column = checkAllBtn.closest('.column');
    const checkboxes = column.checkboxCache;
    const allChecked = checkboxes.every(cb => cb.checked);

    if (allChecked) {
        cancelCheckingAnimation(checkAllBtn); 
        checkAllBtn.classList.remove('checked', 'pop');
        checkAllBtn.classList.add('unchecked', 'reverse-pop');
        checkboxes.forEach(checkbox => {
            checkbox.checked = false;
            saveCheckboxState(checkbox);
        });
        updateProgressBar();
        localStorage.setItem(`checkAllState-${column.id}`, 'unchecked');
    } else {
        startCheckingAnimation(checkAllBtn);
    }
}

// --- Scroll Progress Indicator Function ---
function updateScrollProgressIndicator() {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (window.scrollY / scrollHeight) * 100;
    document.body.style.setProperty('--scroll-width', `${scrollPercent}%`);
}


// --- Page Transition Function ---
function navigateWithTransition(event) {
    event.preventDefault();
    const targetUrl = event.currentTarget.href;
    
    // Create transition elements
    const transitionContainer = document.createElement('div');
    transitionContainer.className = 'transition-container';
    document.body.appendChild(transitionContainer);

    // Add overlay
    const overlay = document.createElement('div');
    overlay.className = 'transition-overlay';
    document.body.appendChild(overlay);

    // Add exit animations to columns
    const columns = document.querySelectorAll('.column');
    let animationsCompleted = 0;
    const totalAnimations = columns.length;

    // Function to check if all animations are done
    const checkAnimationsComplete = () => {
        animationsCompleted++;
        if (animationsCompleted >= totalAnimations) {
            // All animations complete, now fade in overlay and navigate
            requestAnimationFrame(() => {
                overlay.style.opacity = '1';
                
                // Wait for overlay fade to complete before navigation
                setTimeout(() => {
                    window.location.href = targetUrl;
                }, 300); 
            });
        }
    };

    // Add animation end listeners to each column
    columns.forEach((column, index) => {
        const animationClass = index === 0 ? 'exit-left' :
                             index === 1 ? 'exit-middle' : 'exit-right';
        
        // Clone the column to prevent animation interruption
        const clonedColumn = column.cloneNode(true);
        column.parentNode.replaceChild(clonedColumn, column);
        
        clonedColumn.classList.add(animationClass);
        
        // Listen for both animation end events
        const handleAnimationEnd = (e) => {
            if (e.animationName === 'columnExit' || e.animationName === 'columnFade') {
                checkAnimationsComplete();
                clonedColumn.removeEventListener('animationend', handleAnimationEnd);
            }
        };
        
        clonedColumn.addEventListener('animationend', handleAnimationEnd);
    });

    // Backup timeout in case animations fail
    setTimeout(() => {
        if (animationsCompleted < totalAnimations) {
            window.location.href = targetUrl;
        }
    }, 1000); // Fallback timeout
}

// --- Shift+Click Range Selection Function ---
function handleShiftClickSelection(event, checkbox, lastChecked) {
    if (!event.shiftKey || !lastChecked || checkbox === lastChecked) return;

    const labels = Array.from(document.querySelectorAll('.cell label'));
    const startLabel = checkbox.closest('.cell').querySelector('label');
    const endLabel = lastChecked.closest('.cell').querySelector('label');

    let startIndex = labels.indexOf(startLabel);
    let endIndex = labels.indexOf(endLabel);
    if (startIndex > endIndex) [startIndex, endIndex] = [endIndex, startIndex];

    const labelsToToggle = labels.slice(startIndex, endIndex + 1);
    labelsToToggle.forEach(label => {
        const cb = label.querySelector('input[type="checkbox"]');
        cb.checked = lastChecked.checked;
        saveCheckboxState(cb);
    });
    updateProgressBar();


    const affectedColumns = new Set(); // Use a Set to store unique columns
    labelsToToggle.forEach(label => {
        const column = label.closest('.column');
        if (column) {
            affectedColumns.add(column);
        }
    });

    affectedColumns.forEach(column => {
        updateCheckAllButtonState(column); // Update check-all for each affected column
    });
}


// --- Search Functions ---

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Create debounced version of search
const debouncedSearch = debounce(() => {
    performSearch();
}, CONFIG.SEARCH.DEBOUNCE_MS);


function toHalfWidth(str) {
    return str.replace(/[Ａ-Ｚａ-ｚ]/g, s => String.fromCharCode(s.charCodeAt(0) - 0xFEE0));
}

function splitTerm(term) {
    let japanesePart = '';
    let romajiPart = '';
    let inRomaji = false;
    for (const c of term) {
        if (/[ぁ-んァ-ン一-龯]/.test(c)) { japanesePart += c; inRomaji = false; }
        else if (/[a-z]/.test(c)) { romajiPart += c; inRomaji = true; }
        else { if (inRomaji) romajiPart += c; else japanesePart += c; }
    }
    return { japanesePart, romajiPart };
}

function performRomajiSearch(searchTerm) {
    const { japanesePart, romajiPart } = splitTerm(searchTerm);
    if (!romajiPart) return [];

    let romajiSearchResults = [];
    for (const romajiKey in romajiToJapaneseMap) {
        if (romajiKey.includes(romajiPart)) {
            romajiSearchResults.push(romajiToJapaneseMap[romajiKey]);
        }
    }

    const results = [];
    if (romajiSearchResults.length > 0) {
        const allLinks = document.querySelectorAll('.cell a');
        romajiSearchResults.forEach(jpTitle => {
            if (jpTitle.toLowerCase().includes(japanesePart.toLowerCase())) {
                allLinks.forEach(link => {
                    if (link.textContent.toLowerCase().includes(jpTitle.toLowerCase())) {
                        results.push(link);
                    }
                });
            }
        });
    }
    return results;
}

function performJapaneseSearch(searchTerm) {
    const results = [];
    const allLinks = document.querySelectorAll('.cell a');
    allLinks.forEach(link => {
        const linkText = link.textContent.toLowerCase();
        let matched = true;
        let lastIndex = 0;
        for (const char of searchTerm.split('')) {
            const index = linkText.indexOf(char, lastIndex);
            if (index === -1) { matched = false; break; }
            lastIndex = index + 1;
        }
        if (matched) results.push(link);
    });
    return results;
}


function performSearch() {
    const searchTerm = toHalfWidth(searchInput.value.trim().toLowerCase());
    searchResults.innerHTML = '';
    selectedResultIndex = -1;

    const romajiResults = performRomajiSearch(searchTerm);
    const japaneseResults = performJapaneseSearch(searchTerm);
    const combinedResults = [...new Set([...romajiResults, ...japaneseResults])]; // Deduplicate

    if (combinedResults.length > 0) {
        combinedResults.forEach(addSearchResultItem);
    } else {
        const noResults = document.createElement('p');
        noResults.textContent = 'No results found.';
        noResults.style.color = getComputedStyle(document.documentElement).getPropertyValue('--text-secondary');
        searchResults.appendChild(noResults);
    }
    searchModal.classList.add('active');
}

function addSearchResultItem(link, index) {
    const resultContainer = document.createElement('div');
    resultContainer.className = 'search-result-item';
    resultContainer.dataset.index = index;
    const resultLink = document.createElement('a');
    resultLink.href = link.href;
    resultLink.textContent = link.textContent;
    resultContainer.appendChild(resultLink);
    searchResults.appendChild(resultContainer);

    // Existing left-click behavior
    resultLink.addEventListener('click', function(e) {
        e.preventDefault();
        highlightAndScrollToCell(link);
        closeSearchModal();
    });

    // Add right-click behavior - mimic left-click
    resultLink.addEventListener('contextmenu', function(e) {
        e.preventDefault(); // Prevent default context menu on the link
        highlightAndScrollToCell(link);
        closeSearchModal();
    });

    resultContainer.addEventListener('mouseenter', () => {
        if (isMouseMoving) {  // Only update selection if mouse is actually moving
            selectedResultIndex = index;
            updateResultSelection();
        }
    });
}


function updateResultSelection(isHeld = false) { // Set default value for isHeld to false
    const items = searchResults.querySelectorAll('.search-result-item');
    items.forEach((item, index) => {
        item.classList.toggle('selected', index === selectedResultIndex);
    });

    const selectedItem = items[selectedResultIndex];
    if (selectedItem) {
        // Get the container's scroll position info
        const container = searchResults;
        const containerRect = container.getBoundingClientRect();
        const selectedRect = selectedItem.getBoundingClientRect();

        // Check if selected item is outside visible area
        const isAbove = selectedRect.top < containerRect.top;
        const isBelow = selectedRect.bottom > containerRect.bottom;

        if (isAbove || isBelow) {
            selectedItem.scrollIntoView({
                behavior: isHeld ? 'auto' : 'smooth', // Use isHeld to determine behavior
                block: isAbove ? 'start' : 'end'
            });
        }
    }
}

function highlightAndScrollToCell(link) {
    const targetCell = link.closest('.cell');
    if (!targetCell) return;

    const previouslyHighlighted = document.querySelector('.cell.highlighted');
    if (previouslyHighlighted) {
        previouslyHighlighted.classList.remove('highlighted');
        clearTimeout(previouslyHighlighted.highlightTimeout);
    }
    targetCell.classList.add('highlighted');
    targetCell.highlightTimeout = setTimeout(() => targetCell.classList.remove('highlighted'), CONFIG.ANIMATION.HIGHLIGHT_TIMEOUT);

    const headerOffset = document.querySelector('.progress-container').offsetHeight + 20;
    const targetRect = targetCell.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const targetPosition = targetRect.top + window.scrollY - (windowHeight / 2) + (targetRect.height / 2) - headerOffset + 100;

    window.scrollTo({ top: targetPosition, behavior: 'smooth' });
}


// --- Modal Functions ---
function openSearchModal() {
    searchInput.focus();
    searchModal.setAttribute('aria-hidden', 'false');
    document.getElementById('main-content').setAttribute('aria-hidden', 'true');
    
    // Trap focus
    searchModal.addEventListener('keydown', trapTabKey);
  }
  
  function trapTabKey(e) {
    if (e.key === 'Tab') {
      const focusable = searchModal.querySelectorAll('button, [href], input');
      if (focusable.length === 0) return;
      
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      
      if (!e.shiftKey && document.activeElement === last) {
        first.focus();
        e.preventDefault();
      } else if (e.shiftKey && document.activeElement === first) {
        last.focus();
        e.preventDefault();
      }
    }
  }

function closeSearchModal() {
    searchModal.classList.remove('active');
    setTimeout(() => searchResults.innerHTML = '', 400);
    searchInput.value = '';
}


// --- Bookmark Functions ---
function initializeBookmarks() {
    const hrefToCheckboxIdMap = new Map();
    document.querySelectorAll('.cell a').forEach(link => {
        const href = link.href;
        const label = link.closest('label');
        if (label) {
            const checkboxId = label.getAttribute('for');
            if (checkboxId) {
                hrefToCheckboxIdMap.set(href, checkboxId);
            }
        }
    });
    localStorage.setItem('hrefToCheckboxIdMap', JSON.stringify([...hrefToCheckboxIdMap]));

    // Apply bookmarks from localStorage
    document.querySelectorAll('.cell label').forEach(label => {
        const checkbox = label.querySelector('input[type="checkbox"]');
        if (checkbox) {
            const isBookmarked = localStorage.getItem(`bookmark-${checkbox.id}`) === 'true';
            if (isBookmarked) {
                label.setAttribute('data-bookmarked', '');
            } else {
                label.removeAttribute('data-bookmarked');
            }
        }
        label.addEventListener('contextmenu', handleBookmarkContextMenu);
    });
}

function handleBookmarkContextMenu(e) {
    e.preventDefault();
    const label = e.currentTarget;
    const checkbox = label.closest('.cell').querySelector('input[type="checkbox"]');
    const wasBookmarked = label.hasAttribute('data-bookmarked');
    label.toggleAttribute('data-bookmarked');
    if (checkbox) {
        localStorage.setItem(`bookmark-${checkbox.id}`, !wasBookmarked); // Force override
    }
}

document.querySelectorAll('.column').forEach(column => {
    const checkboxesInColumn = column.querySelectorAll('input[type="checkbox"]');
    column.checkboxCache = Array.from(checkboxesInColumn); // Store as an array on the column element
    updateCheckAllButtonState(column); // Initial update
});

// Function to show the confirmation modal
function showConfirmationModal(onConfirm, onCancel) {
    confirmationModal.classList.add('active');
    
    // Handle button clicks
    const handleYes = () => {
        onConfirm();
        hideConfirmationModal();
        cleanup();
    };
    
    const handleNo = () => {
        onCancel();
        hideConfirmationModal();
        cleanup();
    };
    
    const handleOutsideClick = (e) => {
        if (e.target === confirmationModal) {
            handleNo();
        }
    };
    
    // Attach event listeners
    confirmYesBtn.addEventListener('click', handleYes);
    confirmNoBtn.addEventListener('click', handleNo);
    confirmationModal.addEventListener('click', handleOutsideClick);
    
    // Cleanup function to remove event listeners
    const cleanup = () => {
        confirmYesBtn.removeEventListener('click', handleYes);
        confirmNoBtn.removeEventListener('click', handleNo);
        confirmationModal.removeEventListener('click', handleOutsideClick);
    };
}

// Function to hide the confirmation modal
function hideConfirmationModal() {
    confirmationModal.classList.remove('active');
}

// Modify the existing handleCheckAllButtonClick function
function handleCheckAllButtonClick(checkAllBtn) {
    const column = checkAllBtn.closest('.column');
    const checkboxes = column.checkboxCache;
    const allChecked = checkboxes.every(cb => cb.checked);

    if (allChecked) {
        // Show confirmation modal before unchecking all
        showConfirmationModal(
            // onConfirm (Yes)
            () => {
                cancelCheckingAnimation(checkAllBtn);
                checkAllBtn.classList.remove('checked', 'pop');
                checkAllBtn.classList.add('unchecked', 'reverse-pop');
                updateCheckboxesAndState(column, false);
            },
            // onCancel (No)
            () => {
                // Do nothing, keep checkmarks
            }
        );
    } else {
        startCheckingAnimation(checkAllBtn);
    }
}

function showHelpModal() {
    helpModal.classList.add('active');
}

// Function to hide help modal
function hideHelpModal() {
    helpModal.classList.remove('active');
}


// --- Event Listeners and Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    // Initialize progress counter visibility with delay
    setTimeout(() => progressCounter.classList.add('visible'), 500);

    // Initialize checkboxes from localStorage
    document.querySelectorAll('input[type="checkbox"]').forEach(loadCheckboxState);
    updateProgressBar();

    // Initialize Check All Buttons based on actual checkbox states
    document.querySelectorAll('.column').forEach(column => {
        updateCheckAllButtonState(column);
    });

    // Initialize Bookmarks from localStorage and attach context menu listener
    initializeBookmarks();

    // Attach smooth scroll to anchor links
    document.querySelectorAll('a[href^="#"]').forEach(smoothScrollToAnchor);

    // Observe scroll elements for visibility
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0, rootMargin: '50px' });
    document.querySelectorAll('[data-scroll]').forEach(element => observer.observe(element));
});

// Add wheel event handler for modal scrolling
document.addEventListener('wheel', (e) => {
    if (searchModal.classList.contains('active')) {
        const scrollContainer = searchResults; // Use the correctly cached searchResults

        // Check if we're directly interacting with the scroll container
        const isInScrollArea = scrollContainer.contains(e.target) ||
                              e.target === scrollContainer;

        // Calculate container metrics
        const hasScrollSpace = scrollContainer.scrollHeight > scrollContainer.clientHeight;
        const atTop = scrollContainer.scrollTop === 0;
        const atBottom = scrollContainer.scrollTop + scrollContainer.clientHeight >= scrollContainer.scrollHeight;

        if (isInScrollArea && hasScrollSpace) {
            // Allow native scrolling in most cases
            if ((e.deltaY < 0 && atTop) || (e.deltaY > 0 && atBottom)) {
                e.preventDefault(); // Prevent scroll bleed-through at top/bottom
            }
        } else if (searchModal.contains(e.target)) {
            // Prevent main page scrolling when mouse is over modal backdrop
            e.preventDefault(); // Only prevent default scrolling on the modal backdrop, not inside search results
        }
    }
}, { passive: false });

// Checkbox Event Listeners
let lastCheckedCheckbox;
document.querySelectorAll('.cell input[type="checkbox"]').forEach(checkbox => {
    checkbox.addEventListener('change', () => handleCheckboxChange(checkbox));
    checkbox.addEventListener('click', (event) => {
        handleShiftClickSelection(event, checkbox, lastCheckedCheckbox);
        lastCheckedCheckbox = checkbox; // Update lastChecked always
    });
});

// Check All Button Event Listeners
document.querySelectorAll('.column').forEach(column => {
    const checkAllBtn = column.querySelector('.check-all-btn');
    let isMouseDown = false;
    
    checkAllBtn.addEventListener('mousedown', () => { isMouseDown = true; handleCheckAllButtonClick(checkAllBtn); });
    checkAllBtn.addEventListener('mouseleave', () => { if (checkAllBtn.classList.contains('checking') && isMouseDown) cancelCheckingAnimation(checkAllBtn); });
    window.addEventListener('mouseup', () => { if (checkAllBtn.classList.contains('checking')) cancelCheckingAnimation(checkAllBtn); isMouseDown = false; });
});

// Scroll Event Listener for Progress Indicator
let tickingScroll = false;
window.addEventListener('scroll', () => {
    if (!tickingScroll) {
        requestAnimationFrame(() => { updateScrollProgressIndicator(); tickingScroll = false; });
        tickingScroll = true;
    }
});

// Page Transition Event Listeners
document.querySelectorAll('a').forEach(link => link.addEventListener('click', navigateWithTransition));

// Search Event Listeners
searchInput.addEventListener('input', function() {
    selectedResultIndex = -1; // Reset selection on input change
    debouncedSearch();  // Use the debounced version
});

document.addEventListener('mousemove', () => {
    isMouseMoving = true;
    clearTimeout(mouseTimeout);
    mouseTimeout = setTimeout(() => {
        isMouseMoving = false;
    }, 10);
});

document.addEventListener('keydown', (event) => {
    const results = searchResults.querySelectorAll('.search-result-item');
    const hasResults = results.length > 0;

    if (searchModal.classList.contains('active')) {
        switch(event.key) {
            case 'ArrowDown':
            case 'ArrowUp':
                if (!isArrowKeyHeld) {
                    isArrowKeyHeld = true;
                }
                clearTimeout(arrowKeyHoldTimeout);
                
                event.preventDefault();
                if (selectedResultIndex === -1) {
                    // If nothing is selected, select first item regardless of arrow direction
                    selectedResultIndex = 0;
                } else {
                    if (event.key === 'ArrowDown') {
                        selectedResultIndex = selectedResultIndex === results.length - 1 ? 0 : selectedResultIndex + 1;
                    } else {
                        selectedResultIndex = selectedResultIndex === 0 ? results.length - 1 : selectedResultIndex - 1;
                    }
                }
                updateResultSelection(isArrowKeyHeld);
                break;

                case 'Enter':
                if (selectedResultIndex > -1 && results[selectedResultIndex]) {
                    results[selectedResultIndex].querySelector('a').click();
                }
                break;
        }
    }

    if (event.ctrlKey && event.key === 'f') { 
        event.preventDefault(); 
        openSearchModal(); 
    }
    else if (event.key.length === 1 && 
           !event.ctrlKey && 
           !event.metaKey && 
           !event.altKey && 
           !event.target.closest('input, textarea, [contenteditable]') && 
           !searchModal.classList.contains('active')) {
        
        event.preventDefault();
        openSearchModal();
        searchInput.value = event.key.toLowerCase();
        debouncedSearch();
    }
    else if (event.key === 'Escape') {
        closeSearchModal();
    }
});

document.addEventListener('keyup', (event) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        isArrowKeyHeld = false;
        arrowKeyHoldTimeout = setTimeout(() => {
            isArrowKeyHeld = false;
        }, 150);
    }
});

document.addEventListener('click', (event) => {
    if (searchModal.classList.contains('active') && event.target === searchModal) {
        closeSearchModal();
    }
});

document.addEventListener('contextmenu', (event) => {
    if (searchModal.classList.contains('active')) {
        // Check if the right-click target is inside the searchResults container
        if (!searchResults.contains(event.target)) {
            closeSearchModal();
        }
        event.preventDefault(); // Prevent default context menu if modal is active (important!)
        return false;
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'F1' || e.key === 'Help') {
        e.preventDefault(); // Prevent default F1 behavior
        showHelpModal();
    } else if (e.key === 'Escape' && helpModal.classList.contains('active')) {
        hideHelpModal();
    }
});

helpCloseBtn.addEventListener('click', hideHelpModal);

helpModal.addEventListener('click', (e) => {
    if (e.target === helpModal) {
        hideHelpModal();
    }
});

// Prevent context menu on modal
helpModal.addEventListener('contextmenu', (e) => {
    e.preventDefault();
});