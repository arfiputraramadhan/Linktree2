// Layanan Gemini AI untuk fitur-fitur canggih
class GeminiService {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.baseURL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
        this.riwayatPercakapan = [];
        this.diInisialisasi = false;
        this.kataMotivasiAktif = "";
        this.init();
        this.mulaiRotasiKataMotivasi();
    }

    async init() {
        if (this.apiKey && this.apiKey !== 'API_KEY_ANDA_DISINI') {
            this.diInisialisasi = true;
            console.log('✅ Layanan Gemini AI siap digunakan');
        } else {
            console.log('⚠️  API Key Gemini tidak dikonfigurasi, menggunakan mode fallback');
        }
    }

    // Kumpulan kata-kata motivasi dan sad dari orang-orang berpengaruh
    getKataMotivasi() {
        const kataKata = [
            // Albert Einstein
            "Hidup itu seperti naik sepeda. Untuk menjaga keseimbangan, kamu harus terus bergerak. - Albert Einstein",
            "Imajinasi lebih penting daripada pengetahuan. - Albert Einstein",
            "Cobalah tidak untuk menjadi seseorang yang sukses, tetapi menjadi seseorang yang bernilai. - Albert Einstein",
            
            // Steve Jobs
            "Waktumu terbatas, jangan habiskan dengan hidup orang lain. - Steve Jobs",
            "Satu-satunya cara melakukan pekerjaan besar adalah mencintai apa yang kamu lakukan. - Steve Jobs",
            "Tetap lapar, tetap bodoh. - Steve Jobs",
            
            // Nelson Mandela
            "Tampaknya selalu mustahil sampai itu selesai. - Nelson Mandela",
            "Pendidikan adalah senjata paling ampuh yang bisa digunakan untuk mengubah dunia. - Nelson Mandela",
            
            // Mahatma Gandhi
            "Jadilah perubahan yang ingin kamu lihat di dunia. - Mahatma Gandhi",
            "Masa depan tergantung pada apa yang kamu lakukan hari ini. - Mahatma Gandhi",
            
            // BJ Habibie
            "Hidup ini perlu sinergi. Tidak ada yang bisa berjalan sendiri. - BJ Habibie",
            "Kualitas manusia tidak ditentukan oleh seberapa sering ia jatuh, tetapi oleh seberapa cepat ia bangkit. - BJ Habibie",
            
            // Soekarno
            "Beri aku 1.000 orang tua, niscaya akan kucabut Semeru dari akarnya. Beri aku 10 pemuda, niscaya akan kuguncangkan dunia. - Soekarno",
            "Jangan sekali-kali melupakan sejarah. - Soekarno",
            
            // Marie Curie
            "Dalam hidup, tidak ada yang perlu ditakuti, hanya perlu dipahami. - Marie Curie",
            "Kita tidak boleh kehilangan keingintahuan yang tak pernah padam. - Marie Curie",
            
            // Stephen Hawking
            "Kecerdasan adalah kemampuan untuk beradaptasi terhadap perubahan. - Stephen Hawking",
            "Di mana ada kehidupan, di situ ada harapan. - Stephen Hawking",
            
            // Confucius
            "Perjalanan seribu mil dimulai dengan satu langkah. - Confucius",
            "Pilih pekerjaan yang kamu cintai, dan kamu tidak akan pernah bekerja sehari pun dalam hidupmu. - Confucius",
            
            // R.A. Kartini
            "Habis gelap terbitlah terang. - R.A. Kartini",
            "Jadilah matahari yang menyinari, bukan lilin yang membakar diri. - R.A. Kartini",
            
            // Kata-kata "sad" yang dalam
            "Kadang, kesendirian adalah bukti bahwa kamu cukup kuat untuk menghadapi hidup sendirian.",
            "Bukan tentang seberapa keras kamu jatuh, tapi tentang berapa lama kamu memilih untuk tetap di bawah.",
            "Terkadang diam adalah jawaban terbaik. Biarkan hidup yang berbicara.",
            "Kesepian bukan tentang tidak memiliki teman, tapi tentang tidak memiliki diri sendiri.",
            "Air mata adalah kata-kata yang tidak bisa diucapkan oleh hati.",
            "Terlalu banyak berpikir akan menghancurkan kebahagiaanmu.",
            "Kadang kita harus hancur dulu sebelum menjadi versi terbaik dari diri sendiri.",
            "Bukan senyumannya yang palsu, tapi sakitnya yang terlalu nyata untuk ditunjukkan.",
            "Hidup ini terlalu singkat untuk menghabiskan waktu dengan orang yang tidak menghargaimu.",
            "Terkadang, orang yang paling kuat adalah mereka yang menunjukkan kekuatan melalui air mata mereka.",
            
            // Filsuf Yunani
            "Kenali dirimu sendiri. - Socrates",
            "Kualitas bukan suatu tindakan, tetapi kebiasaan. - Aristoteles",
            "Kesulitan mengungkapkan jati diri seseorang. - Epictetus",
            
            // Motivasi modern
            "Jangan takut gagal. Takut akan tidak pernah mencoba.",
            "Mimpi tidak bekerja kecuali kamu melakukannya.",
            "Sukses adalah kumpulan dari usaha-usaha kecil yang berulang.",
            "Hari ini adalah peluang untuk menjadi lebih baik dari kemarin.",
            "Tidak ada elevator menuju sukses. Kamu harus menaiki tangga.",
            
            // Dari ilmuwan
            "Keindahan matematika hanya menunjukkan dirinya kepada para pengikutnya yang lebih sabar. - Maryam Mirzakhani",
            "Sains bukan hanya tentang penjelasan, tapi juga tentang keajaiban. - Richard Feynman",
            "Kita adalah cara alam semesta mengenali dirinya sendiri. - Carl Sagan",
            
            // Penyair dan sastrawan
            "Hidup adalah apa yang terjadi padamu ketika kamu sibuk membuat rencana lain. - John Lennon",
            "Kegelapan tidak bisa mengusir kegelapan, hanya cahaya yang bisa. - Martin Luther King Jr.",
            "Yang terbaik belum datang. - Tulus"

            // Leonardo da Vinci
"Pelajari dulu ilmu seni. Ilmu seni mungkin mengajarkanmu tentang ilmu kehidupan. - Leonardo da Vinci",
"Halangan tidak membuatmu mundur. Setiap rintangan adalah pelajaran. - Leonardo da Vinci",
"Siapa yang tidak menghargai kehidupan, tidak pantas menerimanya. - Leonardo da Vinci"

// Marie Curie
"Tidak ada yang perlu ditakuti dalam hidup, hanya perlu dipahami. - Marie Curie",
"Saya termasuk orang yang berpikir bahwa sains memiliki keindahan luar biasa. - Marie Curie",
"Jangan pernah membiarkan diri Anda putus asa. Kegigihan adalah kunci dari segalanya. - Marie Curie"

// Henry Ford
"Gagal adalah kesempatan untuk memulai lagi dengan lebih cerdas. - Henry Ford",
"Jika semuanya tampak terkendali, berarti Anda tidak melaju cukup cepat. - Henry Ford",
"Bertemu adalah awal, bersama adalah kemajuan, bekerja sama adalah kesuksesan. - Henry Ford"

// Soichiro Honda (pendiri Honda)
"Sukses adalah 99 persen kegagalan. - Soichiro Honda",
"Banyak orang bermimpi besar tetapi tidak pernah bertindak. Jangan jadi salah satunya. - Soichiro Honda",
"Keaslian tidak dapat dihasilkan oleh mereka yang takut melakukan kesalahan. - Soichiro Honda"

// Thomas J. Watson (pendiri IBM)
"Jika Anda ingin sukses, gandakanlah tingkat kegagalan Anda. - Thomas J. Watson",
"Setiap masalah memiliki solusi. Hanya butuh waktu untuk menemukannya. - Thomas J. Watson",
"Jadilah orang yang selalu haus belajar. Dunia bergerak cepat. - Thomas J. Watson"

// Mark Zuckerberg
"Hal terbesar yang bisa kita lakukan adalah memberdayakan orang lain. - Mark Zuckerberg",
"Jangan takut mengambil risiko. Kesalahan terbesar adalah tidak pernah mencoba. - Mark Zuckerberg",
"Ide tidak datang begitu saja. Mereka datang saat Anda bekerja keras. - Mark Zuckerberg"

// Elon Musk
"Ketekunan itu sangat penting. Jangan menyerah kecuali dipaksa menyerah. - Elon Musk",
"Kegagalan adalah pilihan. Jika tidak pernah gagal, berarti Anda tidak cukup berinovasi. - Elon Musk",
"Ketika sesuatu cukup penting, Anda tetap melakukannya meskipun peluangnya tidak berpihak. - Elon Musk"

// Bruce Lee
"Jangan berdoa untuk hidup yang mudah, berdoalah untuk menjadi pribadi yang lebih kuat. - Bruce Lee",
"Batasan itu hanya ada di pikiran. Jika Anda bisa membayangkannya, Anda bisa mencapainya. - Bruce Lee",
"Jadilah seperti air. Air bisa mengalir, bisa menerjang. Jadilah air, temanku. - Bruce Lee"

// Michael Jordan
"Saya gagal berulang kali. Itulah alasan saya sukses. - Michael Jordan",
"Bakat memenangkan pertandingan, tetapi kerja keras dan kerja sama tim memenangkan kejuaraan. - Michael Jordan",
"Rintangan tidak perlu menghalangi Anda. Jika menemui tembok, jangan berbalik. Cari cara untuk memanjatnya. - Michael Jordan"

// Serena Williams
"Kamu boleh memukulku, tapi jangan pernah menjatuhkanku. Aku akan terus bangkit. - Serena Williams",
"Keberhasilan tidak diberikan. Kamu harus mengambilnya. - Serena Williams",
"Saya sangat percaya bahwa tidak ada yang mustahil jika kamu memiliki tekad dan kemauan. - Serena Williams"

// J.K. Rowling
"Batu dasar dari semua kesuksesan adalah kerja keras. - J.K. Rowling",
"Rendah hati sangat penting. Ingatlah selalu dari mana kamu berasal. - J.K. Rowling",
"Kegagalan berarti menghilangkan hal-hal yang tidak penting. Aku berhenti berpura-pura menjadi orang lain. - J.K. Rowling"

// Helen Keller
"Hidup adalah petualangan yang berani atau bukan sama sekali. - Helen Keller",
"Satu-satunya hal yang lebih buruk daripada buta adalah memiliki penglihatan tetapi tidak memiliki visi. - Helen Keller",
"Karakter tidak bisa berkembang dengan mudah. Hanya melalui pengalaman, penderitaan, dan kesulitan jiwa diperkuat. - Helen Keller"

// Confucius (Kong Hu Cu)
"Ke mana pun kamu pergi, pergilah dengan sepenuh hati. - Confucius",
"Orang yang bergerak meski lambat, tidak akan kehilangan arah. - Confucius",
"Dia yang tahu, tidak banyak bicara. Dia yang banyak bicara, tidak tahu. - Confucius"

// Lao Tzu
"Perjalanan seribu mil dimulai dengan satu langkah. - Lao Tzu",
"Ketika kamu puas menjadi dirimu sendiri, semua orang ingin bersamamu. - Lao Tzu",
"Kemudahan mengalahkan kesulitan. Kesabaran mengalahkan kekuatan. - Lao Tzu"

// Jenderal Sudirman
"Tempat saya yang terbaik adalah di belakang senjata. - Jenderal Sudirman",
"Kami tidak akan menyerah sampai titik darah penghabisan. - Jenderal Sudirman",
"Penderitaan rakyat adalah tanggung jawab kami. Kami berjuang untuk kebebasan. - Jenderal Sudirman"

// B.J. Habibie
"Kegagalan hanya terjadi jika kita menyerah. - B.J. Habibie",
"Kerja keras tidak akan mengkhianati hasil. - B.J. Habibie",
"Kita tidak bisa selalu menjadi yang terbaik. Tapi kita bisa selalu berusaha yang terbaik. - B.J. Habibie"

        // Winston Churchill
"Kesuksesan bukanlah akhir, kegagalan bukanlah fatal. Yang terpenting adalah keberanian untuk melanjutkan. - Winston Churchill",
"Kamu tidak akan pernah mencapai tujuan jika berhenti di tengah jalan saat dilempar batu. - Winston Churchill",
"Kegagalan bukanlah satu-satunya hal yang harus ditakuti. Takut untuk tidak mencoba adalah hal yang lebih buruk. - Winston Churchill"

// Nelson Mandela
"Selalu terasa mustahil sampai itu selesai. - Nelson Mandela",
"Saya bukanlah seorang yang kalah. Saya tidak pernah kalah. Entah saya menang, atau saya belajar. - Nelson Mandela",
"Langkah pertama yang terlihat sulit tidak perlu ditakuti. Yang perlu ditakuti adalah tidak melangkah sama sekali. - Nelson Mandela"

// Steve Jobs
"Tetaplah lapar, tetaplah bodoh. - Steve Jobs",
"Satu-satunya cara untuk melakukan pekerjaan hebat adalah dengan mencintai apa yang kamu lakukan. - Steve Jobs",
"Jangan biarkan suara orang lain menenggelamkan suara hatimu sendiri. - Steve Jobs"

// Albert Einstein
"Hidup itu seperti naik sepeda. Untuk menjaga keseimbangan, kamu harus terus bergerak. - Albert Einstein",
"Imajinasi lebih penting daripada pengetahuan. - Albert Einstein",
"Cobalah tidak untuk menjadi seseorang yang sukses, tetapi menjadi seseorang yang bernilai. - Albert Einstein"

// Thomas Edison
"Saya tidak gagal. Saya hanya menemukan 10.000 cara yang tidak berhasil. - Thomas Edison",
"Kelemahan terbesar kita adalah menyerah. Cara paling pasti untuk sukses adalah mencoba sekali lagi. - Thomas Edison",
"Genius adalah satu persen inspirasi dan sembilan puluh sembilan persen keringat. - Thomas Edison"

// R.A. Kartini
"Jangan pernah menyerah jika kamu masih ingin mencoba. - R.A. Kartini",
"Jangan biarkan penyesalan datang karena kamu selangkah lagi untuk menang. - R.A. Kartini",
"Teruslah bermimpi, bermimpilah selama engkau dapat bermimjam. Bila tiada bermimpi, apakah jadinya hidup! - R.A. Kartini"

// Theodore Roosevelt
"Percayalah bahwa kamu bisa, maka kamu sudah setengah jalan menuju keberhasilan. - Theodore Roosevelt",
"Jangan bimbang melakukan apa yang benar, terutama jika itu demi kebaikan banyak orang. - Theodore Roosevelt",
"Keberanian bukanlah tidak memiliki rasa takut, tetapi mampu mengatasi rasa takut. - Theodore Roosevelt"

// Oprah Winfrey
"Ubahlah lukamu menjadi kebijaksanaan. - Oprah Winfrey",
"Kamu mendapatkan apa yang kamu yakini. Bukan apa yang kamu inginkan, tapi apa yang kamu yakini. - Oprah Winfrey",
"Lingkunganmu adalah rumahmu. Jangan takut untuk membangun istana dari puing-puing masa lalumu. - Oprah Winfrey"

// Walt Disney
"Jika kamu bisa memimpikannya, kamu bisa melakukannya. - Walt Disney",
"Cara untuk memulai adalah dengan berhenti bicara dan mulai bertindak. - Walt Disney",
"Semua mimpi kita bisa menjadi kenyataan jika kita memiliki keberanian untuk mengejarnya. - Walt Disney"

// Mahatma Gandhi
"Hiduplah seolah engkau mati besok. Belajarlah seolah engkau hidup selamanya. - Mahatma Gandhi",
"Kekuatan tidak datang dari kemampuan fisik, tetapi dari kemauan yang tidak bisa dihancurkan. - Mahatma Gandhi",
"Jadilah perubahan yang ingin kamu lihat di dunia. - Mahatma Gandhi"
        
        
        ];

        return kataKata[Math.floor(Math.random() * kataKata.length)];
    }

    // Memulai rotasi kata motivasi setiap menit
    mulaiRotasiKataMotivasi() {
        // Update immediately
        this.updateKataMotivasi();
        
        // Update every minute
        setInterval(() => {
            this.updateKataMotivasi();
        }, 60000); // 60 detik
    }

    updateKataMotivasi() {
        this.kataMotivasiAktif = this.getKataMotivasi();
        
        // Update UI jika elemen tersedia
        const elemenMotivasi = document.getElementById('kataMotivasi');
        if (elemenMotivasi) {
            elemenMotivasi.innerHTML = `
                <div class="motivasi-container">
                    <i class="fa-solid fa-quote-left"></i>
                    <span class="motivasi-text">${this.kataMotivasiAktif}</span>
                    <i class="fa-solid fa-quote-right"></i>
                </div>
            `;
            
            // Tambahkan animasi fade
            elemenMotivasi.style.opacity = '0';
            setTimeout(() => {
                elemenMotivasi.style.opacity = '1';
            }, 100);
        }
        
        console.log('🔄 Kata motivasi diperbarui:', this.kataMotivasiAktif);
    }

    // Method untuk mendapatkan kata motivasi saat ini
    dapatkanKataMotivasi() {
        return this.kataMotivasiAktif || this.getKataMotivasi();
    }

    async generateContent(prompt) {
        // Jika API key tidak tersedia, gunakan respons fallback dalam bahasa Indonesia
        if (!this.diInisialisasi) {
            return this.getResponsFallback(prompt);
        }

        try {
            const response = await fetch(`${this.baseURL}?key=${this.apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: `Kamu adalah asisten AI untuk Linktree pribadi Arfi Putra Ramadhan.
                            Arfi adalah seorang yang menyukai musik, teknologi, programming, dan media sosial.
                            
                            INSTRUKSI:
                            - Gunakan bahasa Indonesia yang santai dan friendly
                            - Jawaban maksimal 2-3 kalimat saja
                            - Bersikaplah helpful dan ramah
                            - Gunakan emoji yang relevan
                            - Fokus pada musik, teknologi, dan konten kreatif
                            
                            Konteks percakapan sebelumnya: ${this.riwayatPercakapan.slice(-4).join(' | ')}
                            
                            Pertanyaan user: ${prompt}`
                        }]
                    }],
                    generationConfig: {
                        temperature: 0.7,
                        topK: 40,
                        topP: 0.95,
                        maxOutputTokens: 150,
                    }
                })
            });

            if (!response.ok) {
                throw new Error(`Error HTTP! status: ${response.status}`);
            }

            const data = await response.json();
            
            if (!data.candidates || !data.candidates[0].content.parts[0].text) {
                throw new Error('Format respons API tidak valid');
            }

            const responsAI = data.candidates[0].content.parts[0].text;
            
            // Simpan riwayat percakapan (maksimal 6 pesan)
            this.riwayatPercakapan.push(`User: ${prompt}`, `AI: ${responsAI}`);
            if (this.riwayatPercakapan.length > 6) {
                this.riwayatPercakapan = this.riwayatPercakapan.slice(-6);
            }
            
            return responsAI;

        } catch (error) {
            console.error('Error memanggil API Gemini:', error);
            return this.getResponsFallback(prompt);
        }
    }

    getResponsFallback(prompt) {
        const promptLower = prompt.toLowerCase();
        
        // Respons fallback dalam bahasa Indonesia berdasarkan konteks
        if (promptLower.includes('musik') || promptLower.includes('spotify') || promptLower.includes('lagu')) {
            const responsMusik = [
                "Arfi punya taste musik yang keren! Coba cek playlist Spotify-nya di atas, ada banyak lagu Indonesia dan indie favorit 🎵",
                "Wah, Arfi suka banget sama musik! Dia punya playlist khusus Hindia & Feast di Spotify, worth to listen banget 🎧",
                "Musik itu passion-nya Arfi! Dia sering dengerin berbagai genre, dari indie sampai pop. Cek link Spotify di atas ya! 🎶"
            ];
            return responsMusik[Math.floor(Math.random() * responsMusik.length)];
            
        } else if (promptLower.includes('tiktok') || promptLower.includes('konten') || promptLower.includes('video')) {
            const responsTikTok = [
                "Arfi aktif banget di TikTok dengan konten kreatif! Cek langsung profil TikTok-nya untuk konten seru lainnya 🎥",
                "Di TikTok, Arfi share berbagai konten menarik. Follow aja biar gak ketinggalan update terbaru! ✨",
                "TikTok-nya Arfi worth to follow! Ada banyak konten kreatif dan entertaining di sana 🚀"
            ];
            return responsTikTok[Math.floor(Math.random() * responsTikTok.length)];
            
        } else if (promptLower.includes('instagram') || promptLower.includes('ig') || promptLower.includes('sosmed')) {
            const responsInstagram = [
                "Instagram Arfi isinya daily life dan project-project seru! Perfect banget buat yang mau kenal lebih dekat 📱",
                "Follow Instagram Arfi buat liat update terbaru! Dari kehidupan sehari-hari sampai project kreatif ada di sana 🌟",
                "Arfi cukup aktif di Instagram. Cek aja langsung profilnya untuk konten yang lebih personal! 📸"
            ];
            return responsInstagram[Math.floor(Math.random() * responsInstagram.length)];
            
        } else if (promptLower.includes('teknologi') || promptLower.includes('coding') || promptLower.includes('program')) {
            const responsTeknologi = [
                "Arfi tertarik banget sama teknologi dan programming! Kalau mau diskusi seputar tech, langsung chat via WhatsApp aja 💻",
                "Dunia programming dan teknologi itu passion Arfi! Dia selalu explore hal-hal baru di bidang ini 🚀",
                "Arfi suka banget ngoprek teknologi dan coding. Perfect banget buat diajak kolaborasi project tech! ⚡"
            ];
            return responsTeknologi[Math.floor(Math.random() * responsTeknologi.length)];
            
        } else if (promptLower.includes('apa kabar') || promptLower.includes('halo') || promptLower.includes('hi')) {
            const responsSapaan = [
                "Hai! Kabar baik nih 😊 Ada yang bisa saya bantu? Mau tanya tentang Arfi atau butuh rekomendasi?",
                "Halo! Semoga harimu menyenangkan 🎉 Ada yang bisa saya bantu? Saya siap jawab pertanyaanmu!",
                "Hai hai! Saya asisten AI-nya Arfi. Ada yang mau ditanyakan? Saya di sini buat bantu! ✨"
            ];
            return responsSapaan[Math.floor(Math.random() * responsSapaan.length)];
            
        } else {
            // Respons default dalam bahasa Indonesia
            const responsDefault = [
                "Halo! Saya asisten AI-nya Arfi 🎵 Ada yang bisa saya bantu? Bisa tanya tentang musik, tech, atau konten kreatif!",
                "Hai! Selamat datang di Linktree Arfi ✨ Ada pertanyaan? Saya siap bantu jawab!",
                "Halo! Saya di sini buat bantu kamu kenal lebih dekat dengan Arfi. Mau tanya apa nih? 😊",
                "Hai! Arfi suka banget sama musik dan teknologi. Ada yang mau ditanyakan? Saya siap bantu! 🚀"
            ];
            return responsDefault[Math.floor(Math.random() * responsDefault.length)];
        }
    }

    async generatePersonalizedBio() {
        const prompt = `Buatkan bio personal singkat dalam bahasa Indonesia untuk Arfi Putra Ramadhan yang tertarik dengan musik, teknologi, programming, Spotify, TikTok, dan media sosial. 
        Bio harus maksimal 2 kalimat, catchy, personal, dan sertakan emoji yang relevan.`;
        
        try {
            return await this.generateContent(prompt);
        } catch (error) {
            // Fallback bio dalam bahasa Indonesia
            const bioFallback = [
                "Tech enthusiast & music lover 🎵 | Selalu explore hal baru dan connect dengan orang-orang kreatif 🌟",
                "Digital creator yang passionate di teknologi dan musik 🚀 | Senang banget berkolaborasi dan bikin project seru 💫",
                "Love coding by day, vibing music by night 🎧 | Turning ideas into reality dengan kreativitas ✨",
                "Full-stack dreamer dengan passion di musik 🎶 | Selalu excited untuk kolaborasi dan project baru 🚀"
            ];
            return bioFallback[Math.floor(Math.random() * bioFallback.length)];
        }
    }

    async generateLinkRecommendations() {
        const prompt = `Berdasarkan profil Arfi Putra Ramadhan dengan minat musik, teknologi, programming, Spotify, TikTok, dan media sosial, rekomendasikan 3-4 link website yang relevan untuk ditambahkan di Linktree. 
        Format respons harus JSON array: [{"name": "Nama Link", "url": "https://example.com", "icon": "font-awesome-class", "badge": "Kategori"}]`;
        
        try {
            const response = await this.generateContent(prompt);
            
            // Extract JSON dari respons
            const jsonMatch = response.match(/\[[\s\S]*\]/);
            if (jsonMatch) {
                const rekomendasi = JSON.parse(jsonMatch[0]);
                
                // Validasi dan pastikan URL proper
                return rekomendasi.map(item => ({
                    name: item.name || 'Link',
                    url: item.url && item.url.startsWith('http') ? item.url : 'https://example.com',
                    icon: item.icon || 'fa-solid fa-link',
                    badge: item.badge || 'Lainnya'
                }));
            }
            throw new Error('Format JSON tidak ditemukan');
            
        } catch (error) {
            console.error('Error parsing rekomendasi AI:', error);
            return this.getRekomendasiFallback();
        }
    }

    getRekomendasiFallback() {
        // Rekomendasi fallback dalam bahasa Indonesia
        return [
            { 
                name: "Portfolio GitHub", 
                url: "https://github.com/arfiputraramadhan", 
                icon: "fa-brands fa-github", 
                badge: "Coding" 
            },
            { 
                name: "YouTube Channel", 
                url: "https://youtube.com/@iyacok-l2l?si=LBlr8f9zwKVIVPVy", 
                icon: "fa-brands fa-youtube", 
                badge: "Video" 
            },
             { 
                name: "Apk tabungan", 
                url: "https://privatserver.cyou", 
                icon: "fa-brands fa-github", 
                badge: "Tabungan" 
            },
        
        ];
    }

    async chatWithAI(pesan) {
        try {
            return await this.generateContent(pesan);
        } catch (error) {
            return "Maaf, sedang ada gangguan nih. Coba lagi beberapa saat ya! 😊";
        }
    }

    // Method untuk mereset riwayat percakapan
    resetRiwayat() {
        this.riwayatPercakapan = [];
        console.log('♻️  Riwayat percakapan telah direset');
    }

    // Method untuk mengecek status koneksi
    cekStatus() {
        return {
            diInisialisasi: this.diInisialisasi,
            riwayatPercakapan: this.riwayatPercakapan.length,
            apiKeyTersedia: !!(this.apiKey && this.apiKey !== 'API_KEY_ANDA_DISINI'),
            kataMotivasiAktif: this.kataMotivasiAktif
        };
    }
}

// Inisialisasi Layanan Gemini
const geminiService = new GeminiService(CONFIG.GEMINI_API_KEY);
