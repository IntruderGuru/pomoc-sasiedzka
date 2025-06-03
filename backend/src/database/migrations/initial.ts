import bcrypt from 'bcrypt';

import { randomUUID } from 'crypto';
import { Kysely, sql } from 'kysely';

function addMinutes(date: Date, minutes: number): Date {
    return new Date(date.getTime() + minutes * 60000);
}

function createMessageTimer(start: Date, minGap = 1, maxGap = 10) {
    let current = start;
    return () => {
        const result = current;
        const gap = Math.floor(Math.random() * (maxGap - minGap + 1)) + minGap;
        current = addMinutes(current, gap);
        return result;
    };
}

const nextMessageTime = createMessageTimer(new Date('2024-01-01T10:00:00Z'));

import { Database } from '../connection';

export async function up(db: Kysely<Database>): Promise<void> {
    await db.schema
        .createTable('users')
        .addColumn('id', 'varchar(36)', column => column.primaryKey())
        .addColumn('email', 'varchar(256)', column => column.notNull())
        .addColumn('password', 'varchar(60)', column => column.notNull())
        .addColumn('role', 'varchar(5)', column =>
            column.notNull().check(sql`role IN ('user', 'admin')`)
        )
        .addColumn('username', 'varchar(255)', col => col.notNull().unique())
        .execute();

    await db.schema
        .createTable('announcements')
        .addColumn('id', 'varchar(36)', column => column.primaryKey())
        .addColumn('user_id', 'varchar(36)', column =>
            column
                .notNull()
                .references('users.id')
                .onUpdate('cascade')
                .onDelete('cascade')
        )
        .addColumn('title', 'varchar(256)', column => column.notNull())
        .addColumn('content', 'varchar(256)', column => column.notNull())
        .addColumn('category', 'varchar(256)', column => column.notNull())
        .addColumn('type', 'varchar(256)', column => column.notNull())
        .addColumn('status', 'varchar(8)', column =>
            column
                .notNull()
                .check(sql`status IN ('pending', 'approved', 'rejected')`)
                .defaultTo('pending')
        )
        .addColumn('created_at', 'timestamptz', column =>
            column.notNull().defaultTo(sql`NOW()`)
        )
        .execute();

    await db.schema
        .createTable('messages')
        .addColumn('id', 'varchar(36)', column => column.primaryKey())
        .addColumn('user_id', 'varchar(36)', column =>
            column
                .notNull()
                .references('users.id')
                .onUpdate('cascade')
                .onDelete('cascade')
        )
        .addColumn('receiver_id', 'varchar(36)', column =>
            column
                .notNull()
                .references('users.id')
                .onUpdate('cascade')
                .onDelete('cascade')
        )
        .addColumn('content', 'varchar(256)', column => column.notNull())
        .addColumn('sent_at', 'timestamptz', column =>
            column.notNull().defaultTo(sql`NOW()`)
        )
        .execute();

    await db.schema
        .createTable('comments')
        .addColumn('id', 'varchar(36)', column => column.primaryKey())
        .addColumn('announcement_id', 'varchar(36)', column =>
            column
                .notNull()
                .references('announcements.id')
                .onUpdate('cascade')
                .onDelete('cascade')
        )
        .addColumn('user_id', 'varchar(36)', column =>
            column
                .notNull()
                .references('users.id')
                .onUpdate('cascade')
                .onDelete('cascade')
        )
        .addColumn('content', 'varchar(256)', column => column.notNull())
        .addColumn('sent_at', 'timestamptz', column =>
            column.notNull().defaultTo(sql`NOW()`)
        )
        .execute();

    await db.schema
        .createTable('reactions')
        .addColumn('id', 'varchar(36)', column => column.primaryKey())
        .addColumn('user_id', 'varchar(36)', column =>
            column
                .notNull()
                .references('users.id')
                .onUpdate('cascade')
                .onDelete('cascade')
        )
        .addColumn('announcement_id', 'varchar(36)', column =>
            column
                .references('announcements.id')
                .onUpdate('cascade')
                .onDelete('cascade')
        )
        .addColumn('comment_id', 'varchar(36)', column =>
            column
                .references('comments.id')
                .onUpdate('cascade')
                .onDelete('cascade')
        )
        .addColumn('type', 'varchar(7)', column =>
            column.notNull().check(sql`type IN ('like', 'dislike')`)
        )
        .execute();

    await db.schema
        .createTable('categories')
        .addColumn('id', 'varchar(36)', column => column.primaryKey())
        .addColumn('name', 'varchar(256)', column => column.notNull().unique())
        .addColumn('created_at', 'timestamptz', column =>
            column.notNull().defaultTo(sql`NOW()`)
        )
        .execute();

    await db.schema
        .createTable('audit_logs')
        .addColumn('id', 'varchar(36)', column => column.primaryKey())
        .addColumn('user_id', 'varchar(36)', column =>
            column
                .notNull()
                .references('users.id')
                .onUpdate('cascade')
                .onDelete('cascade')
        )
        .addColumn('action', 'varchar(256)', column => column.notNull())
        .addColumn('announcement_id', 'varchar(36)', column =>
            column
                .references('announcements.id')
                .onUpdate('cascade')
                .onDelete('cascade')
        )
        .addColumn('comment_id', 'varchar(36)', column =>
            column
                .references('comments.id')
                .onUpdate('cascade')
                .onDelete('cascade')
        )
        .addColumn('created_at', 'timestamptz', column =>
            column.notNull().defaultTo(sql`NOW()`)
        )
        .execute();

    await db
        .insertInto('users')
        .values({
            id: randomUUID(),
            email: 'yakui@example.com',
            username: 'yakui',
            role: 'admin' as const,
            password: await bcrypt.hash('themaid', 10)
        },)
        .execute();


    const users = [
        {
            id: randomUUID(),
            email: 'ala.kowalska@somsiad.pl',
            username: 'alak',
            role: 'user' as const,
            password: await bcrypt.hash('haslo1', 10)
        },
        {
            id: randomUUID(),
            email: 'marcin.nowak@somsiad.pl',
            username: 'marcinn',
            role: 'user' as const,
            password: await bcrypt.hash('haslo2', 10)
        },
        {
            id: randomUUID(),
            email: 'ewa.malicka@somsiad.pl',
            username: 'ewam',
            role: 'user' as const,
            password: await bcrypt.hash('haslo3', 10)
        },
        {
            id: randomUUID(),
            email: 'tomasz.jankowski@somsiad.pl',
            username: 'tomeczek',
            role: 'user' as const,
            password: await bcrypt.hash('haslo4', 10)
        },
        {
            id: randomUUID(),
            email: 'beata.kozlowska@somsiad.pl',
            username: 'beatka',
            role: 'user' as const,
            password: await bcrypt.hash('haslo5', 10)
        },
        {
            id: randomUUID(),
            email: 'piotr.wisniewski@somsiad.pl',
            username: 'piotruś',
            role: 'user' as const,
            password: await bcrypt.hash('haslo6', 10)
        },
        {
            id: randomUUID(),
            email: 'monika.kaczmarek@somsiad.pl',
            username: 'monikak',
            role: 'user' as const,
            password: await bcrypt.hash('haslo7', 10)
        },
        {
            id: randomUUID(),
            email: 'krzysztof.adamski@somsiad.pl',
            username: 'krzys_ad',
            role: 'user' as const,
            password: await bcrypt.hash('haslo8', 10)
        },
        {
            id: randomUUID(),
            email: 'dorota.wolanska@somsiad.pl',
            username: 'dorotaw',
            role: 'user' as const,
            password: await bcrypt.hash('haslo9', 10)
        },
        {
            id: randomUUID(),
            email: 'jakub.majewski@somsiad.pl',
            username: 'jakubm',
            role: 'user' as const,
            password: await bcrypt.hash('haslo10', 10)
        },
        {
            id: randomUUID(),
            email: 'anna.piotrowska@somsiad.pl',
            username: 'annapi',
            role: 'user' as const,
            password: await bcrypt.hash('haslo11', 10)
        },
        {
            id: randomUUID(),
            email: 'lukasz.lewandowski@somsiad.pl',
            username: 'lukaszl',
            role: 'user' as const,
            password: await bcrypt.hash('haslo12', 10)
        },
        {
            id: randomUUID(),
            email: 'magdalena.zajac@somsiad.pl',
            username: 'magdaz',
            role: 'user' as const,
            password: await bcrypt.hash('haslo13', 10)
        },
        {
            id: randomUUID(),
            email: 'pawel.kurczewski@somsiad.pl',
            username: 'pawel_k',
            role: 'user' as const,
            password: await bcrypt.hash('haslo14', 10)
        },
        {
            id: randomUUID(),
            email: 'katarzyna.wojcik@somsiad.pl',
            username: 'kasiaw',
            role: 'user' as const,
            password: await bcrypt.hash('haslo15', 10)
        }
    ];
    await db.insertInto('users').values(users).execute();

    const categories = [
        { id: randomUUID(), name: 'Elektronika' },
        { id: randomUUID(), name: 'Usługi' },
        { id: randomUUID(), name: 'Książki' },
        { id: randomUUID(), name: 'Zwierzęta' },
        { id: randomUUID(), name: 'Nauka' }
    ];
    await db.insertInto('categories').values(categories).execute();

    const announcements: Array<{
        id: string;
        user_id: string;
        title: string;
        content: string;
        category: string;
        type: 'oferuję' | 'szukam';
        status: 'pending' | 'approved' | 'rejected';
        created_at: Date;
    }> = [
            {
                id: randomUUID(),
                user_id: users[0].id,
                title: 'Sprzedam monitor ASUS 24" w bardzo dobrym stanie',
                content: 'Monitor ASUS VP249QGR, 24 cale, Full HD, czas reakcji 1ms. Używany pół roku, bez wad, działa idealnie. Odbiór osobisty Warszawa Mokotów.',
                category: 'Elektronika',
                type: 'oferuję',
                status: 'approved',
                created_at: new Date()
            },
            {
                id: randomUUID(),
                user_id: users[1].id,
                title: 'Szukam korepetycji z angielskiego (poziom B2)',
                content: 'Potrzebuję pomocy w przygotowaniu do certyfikatu na poziomie B2. Lekcje online lub stacjonarne (Wrocław). Interesuje mnie konwersacja i gramatyka.',
                category: 'Nauka',
                type: 'szukam',
                status: 'approved',
                created_at: new Date()
            },
            {
                id: randomUUID(),
                user_id: users[2].id,
                title: 'Oddam za darmo kocięta (koteczka i kocurek)',
                content: 'Mama kotka urodziła dwa kocięta. Są zadbane, zdrowe, nauczone do kuwety. Szukam domów w Warszawie i okolicach. Koniecznie z własnym ogródkiem.',
                category: 'Zwierzęta',
                type: 'oferuję',
                status: 'approved',
                created_at: new Date()
            },
            {
                id: randomUUID(),
                user_id: users[3].id,
                title: 'Sprzedam lodówkę SAMSUNG RB37J5000SA/EF',
                content: 'Lodówka SAMSUNG 185 cm, No Frost, klasa A+. Wiek 2 lata, drobne rysy z przodu, działa bez zarzutu. Odbiór osobisty Poznań, Grunwald.',
                category: 'Elektronika',
                type: 'oferuję',
                status: 'approved',
                created_at: new Date()
            },
            {
                id: randomUUID(),
                user_id: users[4].id,
                title: 'Szukam używanej książki „Sto lat samotności” G. G. Márqueza',
                content: 'Zgubiłem egzemplarz z biblioteki szkolnej i pilnie potrzebuję własnego. Może być w dobrym stanie. Mam ograniczony budżet do 20 zł.',
                category: 'Książki',
                type: 'szukam',
                status: 'approved',
                created_at: new Date()
            },
            {
                id: randomUUID(),
                user_id: users[5].id,
                title: 'Oferuję korepetycje z matematyki dla licealistów',
                content: 'Udzielę korepetycji z matematyki na poziomie liceum i matura podstawowa/rozszerzona. Dojazd do ucznia w obrębie Gdańska. Cena 60 zł/h.',
                category: 'Usługi',
                type: 'oferuję',
                status: 'approved',
                created_at: new Date()
            },
            {
                id: randomUUID(),
                user_id: users[6].id,
                title: 'Sprzedam rower górski KROSS Level A3',
                content: 'Rower górski KROSS Level A3 z 2020 roku, koła 27,5”, rama aluminiowa, amortyzator SR Suntour, zmiana biegów Shimano. Stan bardzo dobry.',
                category: 'Usługi',
                type: 'oferuję',
                status: 'approved',
                created_at: new Date()
            },
            {
                id: randomUUID(),
                user_id: users[7].id,
                title: 'Szukam taniego laptopa do podstawowych zadań',
                content: 'Potrzebuję laptopa na studia (Internet, Word, Excel). Maksymalny budżet 800 zł. Preferowany model Lenovo lub Dell, minimum 4 GB RAM.',
                category: 'Elektronika',
                type: 'szukam',
                status: 'approved',
                created_at: new Date()
            },
            {
                id: randomUUID(),
                user_id: users[8].id,
                title: 'Oddam do adopcji psa rasowy jamnik',
                content: 'Jamnik suczka, 3 lata, zaszczepiona, wysterylizowana, przyjazna dzieciom. Oddam w dobre ręce. Odbiór możliwy w Krakowie.',
                category: 'Zwierzęta',
                type: 'oferuję',
                status: 'approved',
                created_at: new Date()
            },
            {
                id: randomUUID(),
                user_id: users[9].id,
                title: 'Szukam płyt winylowych jazzowych',
                content: 'Interesują mnie płyty winylowe z lat 60. i 70. jazz (Miles Davis, John Coltrane, Bill Evans). Odbiór Warszawa Praga lub wysyłka.',
                category: 'Książki',
                type: 'szukam',
                status: 'approved',
                created_at: new Date()
            },
            {
                id: randomUUID(),
                user_id: users[10].id,
                title: 'Usługi ogrodnicze – koszenie trawy, przycinanie żywopłotów',
                content: 'Oferuję prace ogrodnicze w okolicach Wrocławia. Doświadczenie, własny sprzęt (kosiarka, pilarka). Cena do uzgodnienia w zależności od działki.',
                category: 'Usługi',
                type: 'oferuję',
                status: 'approved',
                created_at: new Date()
            },
            {
                id: randomUUID(),
                user_id: users[11].id,
                title: 'Szukam starego komiksu „Thorgal” tom 7',
                content: 'Szukam komiksu Thorgal tom 7: „Pograne karty”. Może być lekko uszkodzony, byle oryginalny. Odbiór lub wysyłka.',
                category: 'Książki',
                type: 'szukam',
                status: 'approved',
                created_at: new Date()
            },
            {
                id: randomUUID(),
                user_id: users[12].id,
                title: 'Sprzedam grill gazowy Broil King',
                content: 'Grill gazowy Broil King Regal 590, 5 palników, rok używania, stan jak nowy, wszystkie elementy działają. Odbiór lokalnie Poznań.',
                category: 'Usługi',
                type: 'oferuję',
                status: 'approved',
                created_at: new Date()
            },
            {
                id: randomUUID(),
                user_id: users[13].id,
                title: 'Szukam nauczyciela gry na pianinie',
                content: 'Chcę rozpocząć naukę gry na pianinie od zera. Lekcje w Warszawie Mokotów lub Ursynów. Możliwe 2 razy w tygodniu po 1 godzinie.',
                category: 'Nauka',
                type: 'szukam',
                status: 'approved',
                created_at: new Date()
            },
            {
                id: randomUUID(),
                user_id: users[14].id,
                title: 'Oddam meble IKEA – kanapa, stół, krzesła',
                content: 'Oddam używane meble z IKEA: kanapa 3-osobowa, stół drewniany i cztery krzesła. Wszystko w dobrym stanie. Odbiór osobisty Kraków.',
                category: 'Dom',
                type: 'oferuję',
                status: 'approved',
                created_at: new Date()
            },

            {
                id: randomUUID(),
                user_id: users[0].id,
                title: 'Szukam używanej konsoli PlayStation 4',
                content: 'Chętnie przyjmę PS4 Slim lub Pro w dobrym stanie. Zależy mi na co najmniej jednym padzie i kablu HDMI. Budżet do 600 zł.',
                category: 'Elektronika',
                type: 'szukam',
                status: 'approved',
                created_at: new Date()
            },
            {
                id: randomUUID(),
                user_id: users[1].id,
                title: 'Oferuję pomoc w transporcie mebli',
                content: 'Dysponuję dużym vanem, mogę pomóc w przeprowadzce lub transporcie mebli na terenie Wrocławia i okolic. Cena do uzgodnienia.',
                category: 'Usługi',
                type: 'oferuję',
                status: 'approved',
                created_at: new Date()
            },
            {
                id: randomUUID(),
                user_id: users[2].id,
                title: 'Sprzedam rower szosowy Giant Contend',
                content: 'Rower szosowy Giant Contend 2, rama 54 cm, stan bardzo dobry, używany amatorsko. Odbiór osobisty Gdańsk.',
                category: 'Usługi',
                type: 'oferuję',
                status: 'approved',
                created_at: new Date()
            },
            {
                id: randomUUID(),
                user_id: users[3].id,
                title: 'Szukam mieszkania do wynajęcia w Gdańsku',
                content: 'Potrzebuję 2-pokojowego mieszkania do 2000 zł/miesięcznie, najlepiej okolice Wrzeszcz lub Morena. Start od lipca.',
                category: 'Usługi',
                type: 'szukam',
                status: 'approved',
                created_at: new Date()
            },
            {
                id: randomUUID(),
                user_id: users[4].id,
                title: 'Oddam duży regał do salonu',
                content: 'Regał drewniany w dobrym stanie, wymiary 180x30x200 cm. Odbiór we Wrocławiu Fabryczna.',
                category: 'Dom',
                type: 'oferuję',
                status: 'approved',
                created_at: new Date()
            },
            {
                id: randomUUID(),
                user_id: users[5].id,
                title: 'Szukam tanich biletów na koncert Coldplay',
                content: 'Interesują mnie miejsca na trybunach od 200 do 400 zł. Koncert w Krakowie, termin 20 lipca 2025.',
                category: 'Usługi',
                type: 'szukam',
                status: 'approved',
                created_at: new Date()
            },
            {
                id: randomUUID(),
                user_id: users[6].id,
                title: 'Sprzedam plecak turystyczny Deuter 50+10',
                content: 'Plecak Deuter ACT Trail 50+10, idealny na długie wycieczki. Stan bardzo dobry, noszony dwa sezony. Odbiór Gliwice.',
                category: 'Usługi',
                type: 'oferuję',
                status: 'approved',
                created_at: new Date()
            },
            {
                id: randomUUID(),
                user_id: users[7].id,
                title: 'Szukam grafika do projektu logo',
                content: 'Potrzebuję kogoś, kto zaprojektuje profesjonalne logo dla małej firmy cateringowej. Budżet 300–500 zł. Termin: do końca czerwca.',
                category: 'Usługi',
                type: 'szukam',
                status: 'approved',
                created_at: new Date()
            },
            {
                id: randomUUID(),
                user_id: users[8].id,
                title: 'Oddam kanapę skórzaną w dobrym stanie',
                content: 'Kanapa skórzana 3-osobowa w kolorze czarnym, kilka drobnych przetarć. Wymiary 220x90x80 cm. Odbiór Katowice.',
                category: 'Dom',
                type: 'oferuję',
                status: 'approved',
                created_at: new Date()
            },
            {
                id: randomUUID(),
                user_id: users[9].id,
                title: 'Szukam książki „Zbrodnia i kara” Fiodora Dostojewskiego',
                content: 'Poszukuję wydania w języku polskim, stan dobry lub bardzo dobry. Budżet do 30 zł. Mogę odebrać w Warszawie.',
                category: 'Książki',
                type: 'szukam',
                status: 'approved',
                created_at: new Date()
            },
            {
                id: randomUUID(),
                user_id: users[10].id,
                title: 'Sprzedam zestaw garnków Tefal',
                content: 'Zestaw 5 garnków Tefal z powłoką nieprzywierającą. Używane rok, stan bardzo dobry. Odbiór Lublin.',
                category: 'Dom',
                type: 'oferuję',
                status: 'approved',
                created_at: new Date()
            },
            {
                id: randomUUID(),
                user_id: users[11].id,
                title: 'Szukam taniego kursu języka hiszpańskiego',
                content: 'Szukam kursu online dla początkujących. Budżet maksymalny: 200 zł. Interesuje mnie konwersacja i podstawy gramatyki.',
                category: 'Nauka',
                type: 'szukam',
                status: 'approved',
                created_at: new Date()
            },
            {
                id: randomUUID(),
                user_id: users[12].id,
                title: 'Oferuję pomoc w montażu mebli IKEA',
                content: 'Zajmuję się montażem mebli od lat. Cena 50 zł za godzinę, dojazd Warszawa i okolice. Gwarancja jakościowo dobrze wykonanej usługi.',
                category: 'Usługi',
                type: 'oferuję',
                status: 'approved',
                created_at: new Date()
            },
            {
                id: randomUUID(),
                user_id: users[13].id,
                title: 'Szukam wolontariatu w schronisku dla zwierząt',
                content: 'Chciałbym pomóc w opiece nad psami i kotami. Jestem dyspozycyjny raz w tygodniu w godzinach popołudniowych. Okolice Krakowa.',
                category: 'Zwierzęta',
                type: 'szukam',
                status: 'approved',
                created_at: new Date()
            },
            {
                id: randomUUID(),
                user_id: users[14].id,
                title: 'Sprzedam zestaw narzędzi Bosch',
                content: 'Zestaw narzędzi Bosch: wiertarka, szlifierka, wyrzynarka. Wszystko w dobrym stanie, komplet akumulatorów. Odbiór Rzeszów.',
                category: 'Usługi',
                type: 'oferuję',
                status: 'approved',
                created_at: new Date()
            }
        ];
    await db.insertInto('announcements').values(announcements).execute();

    const messages = [
        {
            id: randomUUID(),
            user_id: users[0].id,
            receiver_id: users[1].id,
            content: 'Cześć Marcin! Jak się masz?',
            sent_at: nextMessageTime()
        },
        {
            id: randomUUID(),
            user_id: users[1].id,
            receiver_id: users[0].id,
            content: 'Cześć Anna! Dobrze, dzięki. A Ty?',
            sent_at: nextMessageTime()
        },
        {
            id: randomUUID(),
            user_id: users[0].id,
            receiver_id: users[1].id,
            content: 'U mnie wszystko w porządku. Co słychać w pracy?',
            sent_at: nextMessageTime()
        },
        {
            id: randomUUID(),
            user_id: users[1].id,
            receiver_id: users[0].id,
            content: 'Sporo się dzieje, ale daję radę. Mamy nowy projekt.',
            sent_at: nextMessageTime()
        },
        {
            id: randomUUID(),
            user_id: users[0].id,
            receiver_id: users[1].id,
            content: 'Brzmi ciekawie! Opowiedz więcej.',
            sent_at: nextMessageTime()
        },
        {
            id: randomUUID(),
            user_id: users[1].id,
            receiver_id: users[0].id,
            content: 'To aplikacja do zarządzania zadaniami, jeszcze w fazie planowania.',
            sent_at: nextMessageTime()
        },
        {
            id: randomUUID(),
            user_id: users[0].id,
            receiver_id: users[1].id,
            content: 'Chętnie pomogę, jeśli będziesz potrzebować wsparcia!',
            sent_at: nextMessageTime()
        },
        {
            id: randomUUID(),
            user_id: users[1].id,
            receiver_id: users[0].id,
            content: 'Dzięki! Na pewno się odezwę :)',
            sent_at: nextMessageTime()
        },
        {
            id: randomUUID(),
            user_id: users[0].id,
            receiver_id: users[1].id,
            content: 'A jak weekend? Coś planujesz?',
            sent_at: nextMessageTime()
        },
        {
            id: randomUUID(),
            user_id: users[1].id,
            receiver_id: users[0].id,
            content: 'Jeszcze nie wiem, może jakiś spacer albo film. A Ty?',
            sent_at: nextMessageTime()
        }
    ];

    await db.insertInto('messages').values(messages).execute();

    const comments = [
        {
            id: randomUUID(),
            user_id: users[2].id,
            announcement_id: announcements[0].id,
            content: 'Czy do monitora dołączysz kabel DisplayPort czy tylko HDMI?',
            sent_at: new Date()
        },
        {
            id: randomUUID(),
            user_id: users[4].id,
            announcement_id: announcements[0].id,
            content: 'Jaka jest rozdzielczość i czy posiada głośniki wbudowane?',
            sent_at: new Date()
        },
        {
            id: randomUUID(),
            user_id: users[6].id,
            announcement_id: announcements[0].id,
            content: 'Zastanawiam się nad kupnem – czy mogę go przetestować przed wpłatą?',
            sent_at: new Date()
        },

        {
            id: randomUUID(),
            user_id: users[0].id,
            announcement_id: announcements[1].id,
            content: 'Jaki jest koszt jednej lekcji i czy dajesz fakturę?',
            sent_at: new Date()
        },
        {
            id: randomUUID(),
            user_id: users[3].id,
            announcement_id: announcements[1].id,
            content: 'Czy zajęcia mogą być też intensywne w weekendy?',
            sent_at: new Date()
        },
        {
            id: randomUUID(),
            user_id: users[5].id,
            announcement_id: announcements[1].id,
            content: 'Interesuje mnie przygotowanie do rozmowy kwalifikacyjnej – czy to obejmujesz?',
            sent_at: new Date()
        },

        {
            id: randomUUID(),
            user_id: users[1].id,
            announcement_id: announcements[2].id,
            content: 'Czy kocięta są zaszczepione i odrobaczone?',
            sent_at: new Date()
        },
        {
            id: randomUUID(),
            user_id: users[7].id,
            announcement_id: announcements[2].id,
            content: 'Chciałbym je zobaczyć, czy mogę w środę po pracy?',
            sent_at: new Date()
        },
        {
            id: randomUUID(),
            user_id: users[9].id,
            announcement_id: announcements[2].id,
            content: 'Jeśli nie są już dostępne, daj proszę znać – też szukam kociaka.',
            sent_at: new Date()
        },

        {
            id: randomUUID(),
            user_id: users[8].id,
            announcement_id: announcements[3].id,
            content: 'Czy lodówka jest energooszczędna i jaki ma rocznik?',
            sent_at: new Date()
        },
        {
            id: randomUUID(),
            user_id: users[10].id,
            announcement_id: announcements[3].id,
            content: 'Czy mógłbym obejrzeć ją jutro po 17:00?',
            sent_at: new Date()
        },
        {
            id: randomUUID(),
            user_id: users[12].id,
            announcement_id: announcements[3].id,
            content: 'Czy w komplecie jest instrukcja obsługi?',
            sent_at: new Date()
        },

        {
            id: randomUUID(),
            user_id: users[6].id,
            announcement_id: announcements[4].id,
            content: 'Czy książka ma dedykację od poprzedniego właściciela?',
            sent_at: new Date()
        },
        {
            id: randomUUID(),
            user_id: users[11].id,
            announcement_id: announcements[4].id,
            content: 'Czy istnieje możliwość wysyłki paczkomatem?',
            sent_at: new Date()
        },
        {
            id: randomUUID(),
            user_id: users[14].id,
            announcement_id: announcements[4].id,
            content: 'Daj znać, jeśli cena da się lekko obniżyć.',
            sent_at: new Date()
        },

        {
            id: randomUUID(),
            user_id: users[2].id,
            announcement_id: announcements[5].id,
            content: 'Czy korepetycje prowadzisz osobiście czy online?',
            sent_at: new Date()
        },
        {
            id: randomUUID(),
            user_id: users[9].id,
            announcement_id: announcements[5].id,
            content: 'Interesuje mnie przygotowanie do matury rozszerzonej z algebry.',
            sent_at: new Date()
        },
        {
            id: randomUUID(),
            user_id: users[13].id,
            announcement_id: announcements[5].id,
            content: 'Czy dasz rabat na dłuższy kurs (minimum 10 spotkań)?',
            sent_at: new Date()
        },

        {
            id: randomUUID(),
            user_id: users[0].id,
            announcement_id: announcements[6].id,
            content: 'Czy rower ma amortyzowany widelec czy karbonową ramę?',
            sent_at: new Date()
        },
        {
            id: randomUUID(),
            user_id: users[4].id,
            announcement_id: announcements[6].id,
            content: 'Czy koła są oryginalne Shimano czy zmieniane?',
            sent_at: new Date()
        },
        {
            id: randomUUID(),
            user_id: users[11].id,
            announcement_id: announcements[6].id,
            content: 'Czy mogę przetestować rower na trasie 20 km przed zakupem?',
            sent_at: new Date()
        },

        {
            id: randomUUID(),
            user_id: users[3].id,
            announcement_id: announcements[7].id,
            content: 'Czy laptop ma zainstalowany Windows 10 lub 11?',
            sent_at: new Date()
        },
        {
            id: randomUUID(),
            user_id: users[5].id,
            announcement_id: announcements[7].id,
            content: 'Ile baterii laptop trzyma przy normalnym użytkowaniu?',
            sent_at: new Date()
        },
        {
            id: randomUUID(),
            user_id: users[10].id,
            announcement_id: announcements[7].id,
            content: 'Czy dołączona jest oryginalna ładowarka?',
            sent_at: new Date()
        },

        {
            id: randomUUID(),
            user_id: users[1].id,
            announcement_id: announcements[8].id,
            content: 'Czy jamnik jest nauczony chodzić na smyczy?',
            sent_at: new Date()
        },
        {
            id: randomUUID(),
            user_id: users[12].id,
            announcement_id: announcements[8].id,
            content: 'Czy miał już wizytę u weterynarza w ciągu ostatniego miesiąca?',
            sent_at: new Date()
        },
        {
            id: randomUUID(),
            user_id: users[14].id,
            announcement_id: announcements[8].id,
            content: 'Gdzie dokładnie w Krakowie znajduje się pies?',
            sent_at: new Date()
        },

        {
            id: randomUUID(),
            user_id: users[2].id,
            announcement_id: announcements[9].id,
            content: 'Czy płyty są oryginalne, pierwsze wydanie czy reedycja?',
            sent_at: new Date()
        },
        {
            id: randomUUID(),
            user_id: users[6].id,
            announcement_id: announcements[9].id,
            content: 'Czy jest możliwość odsłuchania jednego z albumów przed zakupem?',
            sent_at: new Date()
        },
        {
            id: randomUUID(),
            user_id: users[11].id,
            announcement_id: announcements[9].id,
            content: 'Jaki jest stan RIAA stylu ścierania na okładkach?',
            sent_at: new Date()
        },

        {
            id: randomUUID(),
            user_id: users[0].id,
            announcement_id: announcements[10].id,
            content: 'Jaka cena za przycięcie żywopłotu o długości 30 metrów?',
            sent_at: new Date()
        },
        {
            id: randomUUID(),
            user_id: users[8].id,
            announcement_id: announcements[10].id,
            content: 'Czy masz doświadczenie w sadzeniu roślin dekoracyjnych?',
            sent_at: new Date()
        },
        {
            id: randomUUID(),
            user_id: users[14].id,
            announcement_id: announcements[10].id,
            content: 'Czy oferujesz również podlewanie i nawożenie trawnika?',
            sent_at: new Date()
        },

        {
            id: randomUUID(),
            user_id: users[2].id,
            announcement_id: announcements[11].id,
            content: 'Czy to pierwsze wydanie z lat 90-tych?',
            sent_at: new Date()
        },
        {
            id: randomUUID(),
            user_id: users[5].id,
            announcement_id: announcements[11].id,
            content: 'Jakie są ślady użytkowania na krawędziach okładki?',
            sent_at: new Date()
        },
        {
            id: randomUUID(),
            user_id: users[13].id,
            announcement_id: announcements[11].id,
            content: 'Czy jest dołączona oryginalna folia ochronna?',
            sent_at: new Date()
        },

        {
            id: randomUUID(),
            user_id: users[1].id,
            announcement_id: announcements[12].id,
            content: 'Ile miesięcy gwarancji pozostało?',
            sent_at: new Date()
        },
        {
            id: randomUUID(),
            user_id: users[9].id,
            announcement_id: announcements[12].id,
            content: 'Czy wszystkie palniki działają bez zarzutu?',
            sent_at: new Date()
        },
        {
            id: randomUUID(),
            user_id: users[11].id,
            announcement_id: announcements[12].id,
            content: 'Czy jest w komplecie pokrywka aluminiowa?',
            sent_at: new Date()
        },

        {
            id: randomUUID(),
            user_id: users[0].id,
            announcement_id: announcements[13].id,
            content: 'Jaką liczbę lekcji obejmuje podana cena?',
            sent_at: new Date()
        },
        {
            id: randomUUID(),
            user_id: users[7].id,
            announcement_id: announcements[13].id,
            content: 'Czy lekcje odbywają się na pianinie cyfrowym czy akustycznym?',
            sent_at: new Date()
        },
        {
            id: randomUUID(),
            user_id: users[5].id,
            announcement_id: announcements[13].id,
            content: 'Czy można płacić za pojedyncze lekcje, czy tylko miesięcznie?',
            sent_at: new Date()
        },

        {
            id: randomUUID(),
            user_id: users[2].id,
            announcement_id: announcements[14].id,
            content: 'Czy kanapa jest rozkładana i czy ma pojemnik na pościel?',
            sent_at: new Date()
        },
        {
            id: randomUUID(),
            user_id: users[3].id,
            announcement_id: announcements[14].id,
            content: 'W jakim stanie jest stół – czy powierzchnia ma jakieś rysy?',
            sent_at: new Date()
        },
        {
            id: randomUUID(),
            user_id: users[6].id,
            announcement_id: announcements[14].id,
            content: 'Czy krzesła są stabilne i czy tapicerka jest czysta?',
            sent_at: new Date()
        },

        {
            id: randomUUID(),
            user_id: users[4].id,
            announcement_id: announcements[15].id,
            content: 'Czy konsola jest w oryginalnym pudełku?',
            sent_at: new Date()
        },
        {
            id: randomUUID(),
            user_id: users[9].id,
            announcement_id: announcements[15].id,
            content: 'Czy dołączony pad jest bezprzewodowy czy na kabel?',
            sent_at: new Date()
        },
        {
            id: randomUUID(),
            user_id: users[11].id,
            announcement_id: announcements[15].id,
            content: 'Jaki jest stan dysku twardego w GB?',
            sent_at: new Date()
        },

        {
            id: randomUUID(),
            user_id: users[7].id,
            announcement_id: announcements[16].id,
            content: 'Czy do usługi dołączasz pomoc przy noszeniu ciężkich przedmiotów?',
            sent_at: new Date()
        },
        {
            id: randomUUID(),
            user_id: users[10].id,
            announcement_id: announcements[16].id,
            content: 'Jaka jest maksymalna ładowność tego vana?',
            sent_at: new Date()
        },
        {
            id: randomUUID(),
            user_id: users[14].id,
            announcement_id: announcements[16].id,
            content: 'Czy cena zawiera koszt paliwa?',
            sent_at: new Date()
        },

        {
            id: randomUUID(),
            user_id: users[1].id,
            announcement_id: announcements[17].id,
            content: 'Czy rama jest aluminiowa czy karbonowa?',
            sent_at: new Date()
        },
        {
            id: randomUUID(),
            user_id: users[5].id,
            announcement_id: announcements[17].id,
            content: 'Czy wymieniałeś ostatnio opony na szersze?',
            sent_at: new Date()
        },
        {
            id: randomUUID(),
            user_id: users[12].id,
            announcement_id: announcements[17].id,
            content: 'Chciałbym wypróbować na krótszym odcinku – czy jest to możliwe?',
            sent_at: new Date()
        },

        {
            id: randomUUID(),
            user_id: users[2].id,
            announcement_id: announcements[18].id,
            content: 'Czy czynsz jest wliczony w cenę najmu?',
            sent_at: new Date()
        },
        {
            id: randomUUID(),
            user_id: users[8].id,
            announcement_id: announcements[18].id,
            content: 'Czy mieszkanie jest dostępne od zaraz czy dopiero od lipca?',
            sent_at: new Date()
        },
        {
            id: randomUUID(),
            user_id: users[13].id,
            announcement_id: announcements[18].id,
            content: 'Czy w okolicy jest sklep spożywczy i przystanek autobusowy?',
            sent_at: new Date()
        },

        {
            id: randomUUID(),
            user_id: users[0].id,
            announcement_id: announcements[19].id,
            content: 'Jaki jest kolor i wymiary regału?',
            sent_at: new Date()
        },
        {
            id: randomUUID(),
            user_id: users[4].id,
            announcement_id: announcements[19].id,
            content: 'Czy regał nadaje się do zamocowania na ścianie?',
            sent_at: new Date()
        },
        {
            id: randomUUID(),
            user_id: users[10].id,
            announcement_id: announcements[19].id,
            content: 'Czy są dołączone elementy do montażu?',
            sent_at: new Date()
        },

        {
            id: randomUUID(),
            user_id: users[3].id,
            announcement_id: announcements[20].id,
            content: 'Czy bilety są przelotne czy imienne?',
            sent_at: new Date()
        },
        {
            id: randomUUID(),
            user_id: users[9].id,
            announcement_id: announcements[20].id,
            content: 'Jak wygląda sytuacja z miejscem – trybuna czy płyta?',
            sent_at: new Date()
        },
        {
            id: randomUUID(),
            user_id: users[11].id,
            announcement_id: announcements[20].id,
            content: 'Czy możesz przesłać zdjęcie biletów?',
            sent_at: new Date()
        },

        {
            id: randomUUID(),
            user_id: users[2].id,
            announcement_id: announcements[21].id,
            content: 'Czy plecak ma pokrowiec przeciwdeszczowy w zestawie?',
            sent_at: new Date()
        },
        {
            id: randomUUID(),
            user_id: users[6].id,
            announcement_id: announcements[21].id,
            content: 'Czy pas biodrowy jest regulowany i wygodny?',
            sent_at: new Date()
        },
        {
            id: randomUUID(),
            user_id: users[13].id,
            announcement_id: announcements[21].id,
            content: 'Jaki jest maksymalny udźwig plecaka?',
            sent_at: new Date()
        },

        {
            id: randomUUID(),
            user_id: users[1].id,
            announcement_id: announcements[22].id,
            content: 'Jaka jest Twoja stawka za projekt logo w wektorze?',
            sent_at: new Date()
        },
        {
            id: randomUUID(),
            user_id: users[5].id,
            announcement_id: announcements[22].id,
            content: 'Czy w cenie jest kilka wersji kolorystycznych?',
            sent_at: new Date()
        },
        {
            id: randomUUID(),
            user_id: users[8].id,
            announcement_id: announcements[22].id,
            content: 'Ile czasu zajmuje przygotowanie wstępnego konceptu?',
            sent_at: new Date()
        },

        {
            id: randomUUID(),
            user_id: users[0].id,
            announcement_id: announcements[23].id,
            content: 'Czy muszę wypełnić jakieś ankiety przed adopcją?',
            sent_at: new Date()
        },
        {
            id: randomUUID(),
            user_id: users[4].id,
            announcement_id: announcements[23].id,
            content: 'Czy preferujecie adopcje do domu z dziećmi czy bez?',
            sent_at: new Date()
        },
        {
            id: randomUUID(),
            user_id: users[10].id,
            announcement_id: announcements[23].id,
            content: 'Czy można przyjść wcześniej, by zobaczyć zwierzęta?',
            sent_at: new Date()
        },

        {
            id: randomUUID(),
            user_id: users[2].id,
            announcement_id: announcements[24].id,
            content: 'Ile lat mają elektronarzędzia?',
            sent_at: new Date()
        },
        {
            id: randomUUID(),
            user_id: users[7].id,
            announcement_id: announcements[24].id,
            content: 'Czy do zestawu dodajesz akumulatory?',
            sent_at: new Date()
        },
        {
            id: randomUUID(),
            user_id: users[12].id,
            announcement_id: announcements[24].id,
            content: 'Jaka jest moc wiertarki w Watach?',
            sent_at: new Date()
        }
    ];
    await db.insertInto('comments').values(comments).execute();
}

export async function down(db: Kysely<Database>): Promise<void> {
    await db.schema.dropTable('messages').execute();
    await db.schema.dropTable('reactions').execute();
    await db.schema.dropTable('audit_logs').execute();
    await db.schema.dropTable('comments').execute();
    await db.schema.dropTable('announcements').execute();
    await db.schema.dropTable('users').execute();
    await db.schema.dropTable('categories').execute();
}
