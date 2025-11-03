 {/*

Quero autmotizar o meu saas d egestão de instituições de ensino usando a pi do gpt & gemini como fallback. 
a ideia e ter ter um component em react, que recebe o id da zona onde comtem informação como uma tabela aggird, material ui, ou conteudos elementos html com dados, no frontend 
seremso capzes de netes compoenenconseguir extrara de forma inteligenet os dados da tabela por mais que eets tenham sido renderizados em borçoes ou lista as etc 

por exemplo eu fiz isto para exrar de tabelas :
  const preview = contentEl?.querySelector(".table-preview");
  if (!preview) throw new Error("Tabela de preview não encontrada dentro do conteúdo.");

  const shouldExclude = (name) =>
    excludedColumns.some((ex) => ex.toLowerCase() === String(name || "").toLowerCase());

  const ths = Array.from(preview.querySelectorAll("thead tr th"));
  const allHeaders = ths.map((th) => th.textContent.trim());

  const headerIndices = allHeaders
    .map((h, i) => ({ label: h, index: i }))
    .filter((obj) => !shouldExclude(obj.label));

  const rows = Array.from(preview.querySelectorAll("tbody tr")).map((tr) =>
    Array.from(tr.children).map((td) => td.textContent.trim())
  );

  return { preview, allHeaders, headerIndices, rows };

ma svais melhoara patr que retorne os dados mais orgnaizados e emlheores e em formato json e vbem elebaorado . 
a ideia é que este meu compoenet que vai ser basemeicant oumm assietnete do sisema , vai ser apena sum modal que vai ter um textarea  e um botão para envaiara requisição e depois pegar o reuslddao da requsiaão e depois perguntar como o user pretende procedder ou não com a çaão eue el solicitou
como assim ?

1 - o user vai por exemplo digitar quero que deletes a os alunos paartir do campo nº 12 em diante ou que delets todos sos alunos eme queno campo turma diz JKPL-12-CLASSE, OU GOSTARIA DE FAZER UM RESUMO ESTATISTICO DE QUANTOS ALUNOS DE 23 TEMOS na nossa instituição e me desses este relatorio. 
ou ate gosria que pegasses todos os alunso daturma jklp e mosntasse sum relatorio e enviasses para este numero 923418129, e no servirod eteremos uma forma de tecar se o usr quer envio s demsnagem ou não e se for o relatrio vamos enviar via mensgame por emio de uma função que permite enviar mensagems, para numeros angolanso, 
ou ate se se ele digiatr pior eexemplo se eele dizer no char quero que regsiters este alunso na mnah atbela de estduanets e ele inserri souam serie de dados como nome, genero,etc, automaitcoamenet no servior juantemenet com aapi do chatgtp bmaos organizra os daods ontar um aquery e registara o aluno em nome da isntituiiçao logadae eocm os dado eque ele dei mais de forma beela e organizada.

2 - apos ele enviar o pedido ou soluitação a chat vai rpocessar e vai retronar antes relaizar a asção um conteudo em formato html que deois ser afeito um parse no modal onde o contuedo sera organizad e form ahtml. no servdiro para criara s mensgame vais usar boostap tables, badges, text- para compor o retorno do que seraefeytuado smepre em formato html .
(pode susar classe custumixadas como .grey-text .text-main , .bg-main) para hightlight e cores de destaque.

3 - apos retornar o que sera relaizado ous eja o conjunt de opeaç~eo que s sera executado, e exibir as memsas no modal acoma da caixa de textarae em formato html bonito, vai listara detalahamdsmanet quais opreçaões seraão feitas, e eter um botão para confirmars e no ba kend vais realixraa estas ooepçaçoes . 

4 - vamos supor que o user quira gerar um relatorio, enviar uma informção via email ou sms , vindo da area onde o chat fez a extrçõa de informções e euqir aneviar para alguem ou um email que ele deixou no tetxo que ele fe x para o chat ou ate enviara par aum alauno , enacrregado, prodfessor . 
a nossa backend deve estar prpeado com funç~eos para fazer isso  e com relatorios bonitos ,dianmicos e e smepre mencionando o nome da nossa app, eduall -  software de egstão de eintituições. www.eduall.ao 

5 - como sera a interface e como vou usar etes compoennet boot ? resposta : sera um botão circular com icone de particles tipo pdaas normalmenet suado em ias e ete botão poder ter um tetxo varaido basedo no quisersmos, 
ele sera autonomo no sentido de que tera tetxo perefeitos , se o user etnatra na app o botão podera ter uma anaimação pulse , caso por exemplo tenha encontrado varios alunos duplicados ou com memsmo nuemro o com pfoessores commpoucas presenças ou muitas 
e poder talvez dize olha: remir unifmçoes do dia, rsusmiur informaçoes do paagmento d eproipoans, ou quer que eu prpearae yum rleatoriso de finaças, . ou simplemmenst podmeos abrri e o moal clciando no botãoe ele vai abari o dmoal coma. aqueixa d etxto e spossivel  boteõs ara expoartação de dado eme exe l ou pdf 
que so serão exibido em cenarios em ao is aetreina informção que precis sre exporatda ou em excel ou pdf. modernos . 

7 - o conteudo da ia deve ser bastnate formal e educado pois. epara escolas e esem emojis nas repsosasta, anão ser o necessario paratornara. conversa e as respostas fluidas .

8 - o meu comepoentne ser asimpels de usr e echamar sera algo do tipo :

<EduallSmartBoot  
  content_area={"id da zona em que prteendemos extraiir os dados , pdera ser tabela sou araes com muito ettxo como grid compoente, modal, ou varios compoentes que pdoemar ser id ou classess etc"}
  type_of_actions="delete, add, resume, reports,  update, add, sendmessage, registerbulk" - isto vai permitr saber quais os stipos de lçaão permitidas 
  key_actions={"sera um array que vai conter. os tipos d eopeça~eos baseado nos emsnus, por exmeplo fnaças, poder sera, "relatorio geral , pegar dados completos do meu dahsboard , gerara um ebnvio de infomção e enviar por email para dirtora}
/>


9 - imagina se uma turma não existe e omo sabemso para regsitara turmas nos preciamso de outros dado s como anos academico, classe, sala, cursos etc . 
a api se o usriao uires por exemplo criar multiplas turmas , dizendo quero criar turmas para todos os cursos que acabei de criar pondo o nome da sla, o. nome dio cursos , . no backend junto com ia vamos cobsguiuri criar queries dianmcias sempre usando o code da instuição como tenant. 


7 - no textarea não vamso aceitara mas de 300 chars a ser enciando e avldiad sempre antes d e enviar se tem mais de 300 chars. 

8 -  vou deiar aqui alfusn controlleser e fun~ç~eos+ do backend para pegagres aluma sidiea s e saber como funcioan o meu schema, vais por toos o code do chat em um uncio file usnado o mey executequeruy fucn
para criação d eoperççaoe sou nova stbales, como rgeistro de historitoc d echats. deevar ser rapido e lindo e usar recat-toast para eleratas, os alertas dvenm ser sempre a amigavei e não tecncios pois os user não são devs. 

9 - dev ser rapido e dinamicos nos outputs e smepre belos. 

vou deixra aqui alguns controllers d elaguma sopreçãoe semncionad e no final deve s deixar um guida de como afezr para eu cirsr meis priiso controller s automaticos.

1 - etuantes:


const RegisterStudent = async (req, res) => {
  // ========= helpers curtas =========
  const pad = (n, w = 6) => String(n).padStart(w, "0");

  // Cria schema/índices se faltar (idempotente)
  const ensureSchema = async () => {
    await ExecuteQuery(res, `
      CREATE TABLE IF NOT EXISTS eduall_institute_counters (
        ed_institute_code VARCHAR(100) PRIMARY KEY,
        ed_lastest_student_code BIGINT NOT NULL DEFAULT 0
      ) ENGINE=InnoDB
    `, [], false, { db: "eduall_institute_counters", type: "schema", data: req });

    await ExecuteQuery(res, `
      CREATE UNIQUE INDEX IF NOT EXISTS ux_students_institute_code
      ON eduall_students (ed_student_institute_code, ed_student_code)
    `, [], false, { db: "eduall_students", type: "index", data: req });
  };

  // Garante linha do contador
  const ensureCounterRow = async (inst) => {
    await ExecuteQuery(res, `
      INSERT INTO eduall_institute_counters (ed_institute_code, ed_lastest_student_code)
      VALUES (?, 0)
      ON DUPLICATE KEY UPDATE ed_lastest_student_code = ed_lastest_student_code
    `, [inst], false, { db: "eduall_institute_counters", type: "upsert", data: req });
  };

  // Aloca código sem consumir (só confirma após INSERT)
  const lockAndProposeCode = async (inst, incomingCode) => {
    const row = await ExecuteQuery(
      res,
      `SELECT ed_lastest_student_code FROM eduall_institute_counters WHERE ed_institute_code = ? FOR UPDATE`,
      [inst],
      true,
      { db: "eduall_institute_counters", type: "select-for-update", data: req }
    );

    let last = (row[0]?.ed_lastest_student_code ?? 0) * 1;

    if (incomingCode && String(incomingCode).trim() !== "") {
      const raw = String(incomingCode).trim();
      const num = parseInt(raw.replace(/\D/g, ""), 10);
      if (!Number.isFinite(num) || num < 0) throw new Error("Código de matrícula inválido.");

      // 🔒 Sempre 6 dígitos fixos
      const codeStr = pad(num, 6);
      return { codeNum: num, codeStr, width: 6, shouldBumpTo: Math.max(last, num) };
    } else {
      const next = last + 1;
      const codeStr = pad(next, 6);
      return { codeNum: next, codeStr, width: 6, shouldBumpTo: next };
    }
  };

  try {
    await ensureSchema();

    // ---- valida idade
    const birthday = new Date(req.body.student_birthday);
    const today = new Date();
    const twoYearsAgo = new Date(); twoYearsAgo.setFullYear(today.getFullYear() - 2);
    if (isNaN(birthday.getTime()) || birthday > today || birthday > twoYearsAgo) {
      return res.status(400).json({ success: false, msg: "Data de nascimento inválida! O estudante deve ter pelo menos 2 anos de idade !" });
    }

    const instituteCode = req.session.user.eduall_user_session_curentinstitute;
    const instituteType = req.session.user.eduall_user_session_curentinstitute_type * 1;

    // ---- duplicado de BI por escola? Se sim, sai
    const dupBI = await ExecuteQuery(
      res,
      `SELECT 1 FROM eduall_students WHERE ed_student_deleted = 0 AND ed_student_identityCard = ? AND ed_student_institute_code = ? LIMIT 1`,
      [String(req.body.student_identityCard || "").toLowerCase(), instituteCode],
      true,
      { db: "eduall_students", type: "select", data: req }
    );
    if (dupBI.length > 0) {
      return res.status(400).json({ success: false, msg: "Já existe um estudante cadastrado na instituição com este BI" });
    }

    // ---- transação: só confirma contador após INSERT
    await ExecuteQuery(res, `START TRANSACTION`, [], false, { db: "tx", type: "begin", data: req });
    try {
      await ensureCounterRow(instituteCode);

      const incomingCode = req.body.student_code;
      const { codeStr, codeNum, shouldBumpTo } = await lockAndProposeCode(instituteCode, incomingCode);

      // garantir unicidade por escola
      const dupCode = await ExecuteQuery(
        res,
        `SELECT 1 FROM eduall_students WHERE ed_student_deleted = 0 AND ed_student_code = ? AND ed_student_institute_code = ? LIMIT 1`,
        [codeStr, instituteCode],
        true,
        { db: "eduall_students", type: "select", data: req }
      );
      if (dupCode.length > 0) {
        const row = await ExecuteQuery(
          res,
          `SELECT ed_lastest_student_code FROM eduall_institute_counters WHERE ed_institute_code = ? FOR UPDATE`,
          [instituteCode],
          true,
          { db: "eduall_institute_counters", type: "select-for-update", data: req }
        );
        const fallbackNum = (row[0]?.ed_lastest_student_code ?? 0) + 1;
        req.body.student_code = pad(fallbackNum, 6);
      } else {
        req.body.student_code = codeStr;
      }

      const insertQuery = `
        INSERT INTO eduall_students(
          ed_student_name, ed_student_address, ed_student_nacionality, ed_student_gender,
          ed_student_religion, ed_student_birthday, ed_student_phone, ed_student_email,
          ed_student_class, ed_student_code, ed_student_picture, ed_student_identityCard,
          ed_student_health_problems, ed_student_health_problems_description, ed_student_status,
          ed_student_naturalness, ed_student_institute_code, ed_student_type
        ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
      `;
      const insertParams = [
        req.body.student_name, req.body.student_address, req.body.student_nacionality, req.body.student_gender,
        req.body.student_religion, req.body.student_birthday, req.body.student_phone, req.body.student_email,
        req.body.student_class, req.body.student_code, (req.file ? "images/students/" + req.file.filename : ""),
        req.body.student_identityCard, req.body.student_health_problems, req.body.student_health_problems_description,
        req.body.student_status, req.body.student_naturalness, instituteCode, instituteType
      ];
      const studentInsertResult = await ExecuteQuery(res, insertQuery, insertParams, false, { db: "eduall_students", type: "insert", data: req });

      const {
        student_lastschool_course, student_lastschool_score, student_lastschool_formationfield, student_lastschool_conclusionyear,
        student_lifeconditions, student_socialsecurity, student_sociallevel, student_workstatus, student_workplace, student_worktitle
      } = req.body;

      await ExecuteQuery(
        res,
        `INSERT INTO eduall_students_details(
           ed_detail_student_code, ed_detail_lastschool_course, ed_detail_lastschool_score,
           ed_detail_lastschool_formationfield, ed_detail_lastschool_conclusionyear, ed_detail_lifeconditions,
           ed_detail_socialsecurity, ed_detail_sociallevel, ed_detail_work, ed_detail_workplace, ed_detail_workfunction
         ) VALUES (?,?,?,?,?,?,?,?,?,?,?)`,
        [
          studentInsertResult.insertId, student_lastschool_course, student_lastschool_score, student_lastschool_formationfield,
          student_lastschool_conclusionyear, student_lifeconditions, student_socialsecurity, student_sociallevel,
          student_workstatus, student_workplace, student_worktitle
        ],
        false,
        { db: "eduall_students_details", type: "insert", data: req }
      );

      await RegisterAuditAction({
        session: req.session,
        action: 1,
        form: "Estudantes",
        description: `Registrou estudante - (${req.body.student_name})`,
      });

      await ExecuteQuery(
        res,
        `UPDATE eduall_institute_counters
         SET ed_lastest_student_code = GREATEST(ed_lastest_student_code, ?)
         WHERE ed_institute_code = ?`,
        [codeNum, instituteCode],
        false,
        { db: "eduall_institute_counters", type: "update", data: req }
      );

      await ExecuteQuery(res, `COMMIT`, [], false, { db: "tx", type: "commit", data: req });

      return res.status(201).json({ success: true, message: "Student registered successfully!", student_code: req.body.student_code });
    } catch (e) {
      await ExecuteQuery(res, `ROLLBACK`, [], false, { db: "tx", type: "rollback", data: req });
      if (/duplic/i.test(e.message)) {
        return res.status(409).json({ success: false, msg: "Código de matrícula já existe nesta escola." });
      }
      return res.status(500).json({ success: false, msg: "Falha ao registar estudante.", error: e.message });
    }
  } catch (error) {
    return res.status(500).json({ success: false, msg: "Erro interno.", error: error.message });
  }
};


const StudentDelete = async (req, res) => {
   try {
      const { ID } = req.params;
      const query = `UPDATE eduall_students SET ed_student_deleted = 1 WHERE ed_student_deleted = 0 AND ed_student_id = ? AND ed_student_institute_code = ?`;
      const PARAMS = [ID, req.session.user.eduall_user_session_curentinstitute];
   
      const query1 = `UPDATE eduall_students_details SET ed_detail_deleted = 1 WHERE ed_detail_deleted = 0 AND ed_detail_student_code = ?`;
      const PARAMS1 = [ID];
   
      await ExecuteQuery(res, query1, PARAMS1, false, { db: "eduall_students_details", type: "update", data: req });
     const resp =  await ExecuteQuery(res, query, PARAMS, false, {
         db: "eduall_students",
         type: "update",
         data: req,
       }); 
               
      await RegisterAuditAction({
         session: req.session,
         action: 3,  // Ação de delete
         form: "Estudantes",
         description: `Removeu um  estudante com o nº de matrícula #${ID}`,
       });
       
      const query3 = `SELECT * FROM eduall_students WHERE ed_student_id = ?`;
      const PARAMS3 = [ID]; 
      const rows = await ExecuteQuery(res, query3, PARAMS3, true, { db: "eduall_students", type: "select", data: req });

      console.log(" res = ", resp); 
      res.status(200).json({ success: true, msg: "Student successfully deleted." });
   } catch (err) {
      res.status(400).json({ status: 300, success: false, msg: err.message });
   }
};

const StudentUpdate = async (req, res) => { 
   try {
      const { ID } = req.params;
      const {
         student_name, student_age, student_address, student_nacionality, student_gender, student_religion,
         student_birthday, student_phone, student_phone2, student_email, student_class, student_code,
         student_identityCard, student_health_problems, student_naturalness, student_health_problems_description, student_status,
         student_lastschool_course, student_lastschool_score, student_lastschool_formationfield, student_lastschool_conclusionyear,
         student_lifeconditions, student_socialsecurity, student_sociallevel, student_workstatus, student_workplace, student_worktitle
      } = req.body;

      // Validação da data de nascimento
      if (!student_birthday || isNaN(new Date(student_birthday).getTime())) {
         return res.status(400).json({ success: false, msg: "Data de nascimento inválida." });
      }

      const birthdayDate = new Date(student_birthday);
      const today = new Date();
      if (birthdayDate > today) {
         return res.status(400).json({ success: false, msg: "A data de nascimento não pode ser no futuro." });
      }

      let query = ``;
      let PARAMS = ``;

      if (req.file) {
         query = `UPDATE eduall_students SET ed_student_name = ?, ed_student_address = ?, ed_student_nacionality = ?, ed_student_gender = ?, ed_student_religion = ?, 
         ed_student_birthday = ?, ed_student_phone = ?, ed_student_phone2 = ?, ed_student_email = ?, ed_student_class = ?, ed_student_code = ?, ed_student_picture = ?,
         ed_student_identityCard = ?, ed_student_health_problems = ?, ed_student_health_problems_description = ?, ed_student_status = ?, ed_student_naturalness = ?
         WHERE ed_student_deleted = 0 AND ed_student_id = ? AND ed_student_institute_code = ?`;
         PARAMS = [student_name, student_address, student_nacionality, student_gender, student_religion,
            student_birthday, student_phone, student_phone2, student_email, student_class, student_code,
            "images/students/" + req.file.filename, student_identityCard, student_health_problems,
            student_health_problems_description, student_status, student_naturalness, ID, req.session.user.eduall_user_session_curentinstitute];
      } else {
         query = `UPDATE eduall_students SET ed_student_name = ?, ed_student_address = ?, ed_student_nacionality = ?, ed_student_gender = ?, ed_student_religion = ?, 
         ed_student_birthday = ?, ed_student_phone = ?, ed_student_phone2 = ?, ed_student_email = ?, ed_student_class = ?, ed_student_code = ?, 
         ed_student_identityCard = ?, ed_student_health_problems = ?, ed_student_health_problems_description = ?, ed_student_status = ?, ed_student_naturalness = ?
         WHERE ed_student_deleted = 0 AND ed_student_id = ? AND ed_student_institute_code = ?`;
         PARAMS = [student_name, student_address, student_nacionality, student_gender, student_religion,
            student_birthday, student_phone, student_phone2, student_email, student_class, student_code,
            student_identityCard, student_health_problems, student_health_problems_description, student_status, student_naturalness,
            ID, req.session.user.eduall_user_session_curentinstitute];
      }

      await ExecuteQuery(res, query, PARAMS, false, { db: "eduall_students", type: "update", data: req });

      const query3 = `SELECT * FROM eduall_students_details WHERE ed_detail_deleted = 0 AND ed_detail_student_code = ?`;
      const PARAMS3 = [ID];

      const rows = await ExecuteQuery(res, query3, PARAMS3, true, { db: "eduall_students_details", type: "select", data: req });

      if (rows.length === 0) {
         const query2 = `INSERT INTO eduall_students_details(ed_detail_student_code, ed_detail_lastschool_course, ed_detail_lastschool_score,
         ed_detail_lastschool_formationfield, ed_detail_lastschool_conclusionyear, ed_detail_lifeconditions, ed_detail_socialsecurity,
         ed_detail_sociallevel, ed_detail_work, ed_detail_workplace, ed_detail_workfunction) VALUES (?,?,?,?,?,?,?,?,?,?,?)`;
         const PARAMS1 = [ID, student_lastschool_course, student_lastschool_score, student_lastschool_formationfield,
            student_lastschool_conclusionyear, student_lifeconditions, student_socialsecurity, student_sociallevel,
            student_workstatus, student_workplace, student_worktitle];
         await ExecuteQuery(res, query2, PARAMS1, false, { db: "eduall_students_details", type: "insert", data: req });
      } else {
         const query2 = `UPDATE eduall_students_details SET ed_detail_lastschool_course = ?, ed_detail_lastschool_score = ?,
         ed_detail_lastschool_formationfield = ?, ed_detail_lastschool_conclusionyear = ?, ed_detail_lifeconditions = ?, ed_detail_socialsecurity = ?,
         ed_detail_sociallevel = ?, ed_detail_work = ?, ed_detail_workplace = ?, ed_detail_workfunction = ?
         WHERE ed_detail_student_code = ? AND ed_detail_deleted = 0`;
         const PARAMS1 = [student_lastschool_course, student_lastschool_score, student_lastschool_formationfield,
            student_lastschool_conclusionyear, student_lifeconditions, student_socialsecurity, student_sociallevel,
            student_workstatus, student_workplace, student_worktitle, ID];
         await ExecuteQuery(res, query2, PARAMS1, false, { db: "eduall_students_details", type: "update", data: req });
      }

      await RegisterAuditAction({
         session: req.session,
         action: 2,  // Ação de atualização
         form: "Estudantes",
         description: `Atualizou os dados do estudante com o nº de matrícula #${ID}`,
       });
      res.status(200).json({ success: true, msg: "Estudante atualizado com sucesso." });
   } catch (err) {
      res.status(400).json({ status: 300, success: false, msg: err.message });
   }
};


b - turmas :


const normalize = (str) => {
  if (!str) return "";

  // 1. tudo minúsculo
  let normalized = str.toLowerCase();

  // 2. remover acentos
  normalized = normalized.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  // 3. substituir ordinais: "ª" e "º" viram vazio
  normalized = normalized.replace(/[ºª]/g, "");

  // 4. remover tudo que não é letra ou número (inclui espaços e símbolos)
  normalized = normalized.replace(/[^a-z0-9]/g, "");

  return normalized;
};


const RegisterClass = async (req, res) => {
  try {
    const rawClassTitle = req.body.class_title.trim();

    // Normalizar no JS só para sugestão de nome
    const normalize = (str) => {
      if (!str) return "";
      let normalized = str.toLowerCase();
      normalized = normalized.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      normalized = normalized.replace(/[ºª]/g, "");
      normalized = normalized.replace(/[^a-z0-9]/g, "");
      return normalized;
    };

    const normalizedInputTitle = normalize(rawClassTitle);

    const instituteCode = req.session.user.eduall_user_session_curentinstitute;

    // Query para checar no banco com normalização dentro da query
    const checkQuery = `
      SELECT ed_class_title FROM eduall_class 
      WHERE 
        LOWER(REPLACE(REPLACE(REPLACE(ed_class_title, ' ', ''), 'ª', ''), 'º', '')) = LOWER(REPLACE(REPLACE(REPLACE(?, ' ', ''), 'ª', ''), 'º', ''))
        AND ed_class_institute_code = ?
        AND ed_class_deleted = 0
    `;
    const checkParams = [rawClassTitle, instituteCode];

    const existing = await ExecuteQuery(res, checkQuery, checkParams, true, {
      db: "eduall_class", type: "select", data: req,
    });

    if (existing.length > 0) {
      // Sugestão de nome baseado na normalização JS para garantir não conflito
      let suggestedTitle = `${rawClassTitle} ${new Date().getFullYear()}`;
      let index = 2;

      // Aqui você pode buscar todos os títulos e verificar no JS normalizado os similares para sugerir índice
      const allTitlesQuery = `
        SELECT ed_class_title FROM eduall_class 
        WHERE ed_class_institute_code = ? AND ed_class_deleted = 0
      `;
      const allTitles = await ExecuteQuery(res, allTitlesQuery, [instituteCode], true, {
        db: "eduall_class", type: "select", data: req,
      });

      while (
        allTitles.some(c => normalize(c.ed_class_title) === normalize(`${rawClassTitle} ${index}`))
      ) {
        index++;
      }
      suggestedTitle = `${rawClassTitle} ${index}`;

      return res.status(400).json({
        status: 400,
        success: false,
        msg: `Já existe uma turma com um nome muito similar. Por favor, utilize uma nomenclatura diferenciada. Ex: ( ${suggestedTitle} )`,
        suggestion: suggestedTitle,
      });
    }

    // Continua com a inserção normal da turma
    const query = `INSERT INTO eduall_class(
      ed_class_title, ed_class_faculty, ed_class_code, ed_class_course, ed_class_period, ed_class_year,
      ed_class_room, ed_class_cicle, ed_class_academic_level, ed_class_description, ed_class_subjects, ed_class_institute_code)
      VALUES(?,?,?,?,?,?,?,?,?,?,?,?)`;

    const PARAMS = [
      req.body.class_title, req.body.class_faculty, req.body.class_code, req.body.class_course, req.body.class_period,
      req.body.class_year, req.body.class_room, req.body.class_cicle, req.body.class_academic_level,
      req.body.class_description, req.body.class_subjects, instituteCode
    ];

    const rows = await ExecuteQuery(res, query, PARAMS, false, {
      db: "eduall_class", type: "insert", data: req,
    });

    await RegisterAuditAction({
      session: req.session,
      action: 1,
      form: "Turmas",
      description: `Registrou uma nova turma (${req.body.class_title}) com o código ${req.body.class_code}`,
    });

    res.status(200).json(rows);

  } catch (error) {
    return res.status(500).json({ status: 500, success: false, error: error.message });
  }
};




const ClassDelete = async (req, res) => {
  try {
    const { ID } = req.params;
    const instituto = req.session.user.eduall_user_session_curentinstitute;

    // Verificar se existem estudantes ativos associados à turma
    const checkQuery = `SELECT COUNT(*) AS total FROM eduall_students 
                        WHERE ed_student_deleted = 0 AND ed_student_class = ? AND ed_student_institute_code = ?`;
    const checkParams = [ID, instituto];
    const checkResult = await ExecuteQuery(res, checkQuery, checkParams, true, {
      db: "eduall_students",
      type: "select",
      data: req,
    });

    const studentCount = checkResult[0]?.total || 0;

    if (studentCount > 0) {
      return res.status(400).json({
        success: false,
        msg: `Não é possível deletar. Existem ${studentCount} alunos ainda associados a esta turma.`,
      });
    }

    // Deletar a turma se não houver alunos
    const query = `UPDATE eduall_class SET ed_class_deleted = 1 
                   WHERE ed_class_deleted = 0 AND ed_class_id = ? AND ed_class_institute_code = ?`;
    const PARAMS = [ID, instituto];
    const rows = await ExecuteQuery(res, query, PARAMS, false, {
      db: "eduall_class",
      type: "update",
      data: req,
    });

    // Registrar ação de auditoria
    await RegisterAuditAction({
      session: req.session,
      action: 3,  // Ação de eliminação
      form: "Turmas",
      description: `Eliminou a turma com ID ${ID}`,
    });

    res.status(200).json(rows);
  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: "Erro ao tentar deletar a turma!",
      error: error.message,
    });
  }
};


3 - anos academicos:



const RegisterAcademicLevel = async (req, res) => {
  try {
    const rawTitle = req.body.academic_level_title.trim();

    // Função para normalizar título
    const normalize = (str) => {
      if (!str) return "";
      let normalized = str.toLowerCase();
      normalized = normalized.normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // Remove acentos
      normalized = normalized.replace(/[ºª]/g, ""); // Remove º e ª
      normalized = normalized.replace(/[^a-z0-9]/g, ""); // Remove tudo que não é alfanumérico
      return normalized;
    };

    const instituteCode = req.session.user.eduall_user_session_curentinstitute;

    // Verificar existência normalizando direto no SQL
    const checkQuery = `
      SELECT ed_academic_level_title FROM eduall_academic_level 
      WHERE 
        LOWER(REPLACE(REPLACE(REPLACE(ed_academic_level_title, ' ', ''), 'ª', ''), 'º', '')) = LOWER(REPLACE(REPLACE(REPLACE(?, ' ', ''), 'ª', ''), 'º', ''))
        AND ed_academic_level_institute_code = ?
        AND ed_academic_level_deleted = 0
    `;
    const checkParams = [rawTitle, instituteCode];

    const existing = await ExecuteQuery(res, checkQuery, checkParams, true, {
      db: "eduall_academic_level",
      type: "select",
      data: req,
    });

    if (existing.length > 0) {
      return res.status(400).json({
        status: 400,
        success: false,
        msg: `Já existe um nível acadêmico com um nome muito similar. Por favor, utilize um nome diferente.`,
      });
    }

    // Inserir novo nível acadêmico
    const query = `INSERT INTO eduall_academic_level(
      ed_academic_level_title, ed_academic_level_forExam, ed_academic_level_forFt, ed_academic_level_institute_code)
      VALUES (?, ?, ?, ?)`;

    const PARAMS = [
      req.body.academic_level_title,
      req.body.academic_level_forExam,
      req.body.academic_level_forFt,
      instituteCode,
    ];

    const rows = await ExecuteQuery(res, query, PARAMS, false, {
      db: "eduall_academic_level",
      type: "register",
      data: req,
    });

    await RegisterAuditAction({
      session: req.session,
      action: 1,
      form: "Níveis acadêmico",
      description: `Registrou um nível acadêmico novo (${req.body.academic_level_title})`,
    });

    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ success: false, message: "Falha ao registrar o nível acadêmico!", error: error.message });
  }
};

 
const AcademicLevelUpdate = async (req, res) => {
  try {
    const { ID } = req.params;
    const { academic_level_title, academic_level_forExam, academic_level_forFt } = req.body;
    const instituteCode = req.session.user.eduall_user_session_curentinstitute;

    const normalize = (str) => {
      if (!str) return "";
      let normalized = str.toLowerCase();
      normalized = normalized.normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // Remove acentos
      normalized = normalized.replace(/[ºª]/g, ""); // Remove º e ª
      normalized = normalized.replace(/[^a-z0-9]/g, ""); // Remove tudo que não é alfanumérico
      return normalized;
    };

    // Buscar título atual para comparar
    const currentTitleQuery = `SELECT ed_academic_level_title FROM eduall_academic_level 
      WHERE ed_academic_level_id = ? AND ed_academic_level_institute_code = ? AND ed_academic_level_deleted = 0`;
    const currentTitleResult = await ExecuteQuery(res, currentTitleQuery, [ID, instituteCode], true, {
      db: "eduall_academic_level",
      type: "select",
      data: req,
    });

    if (currentTitleResult.length === 0) {
      return res.status(404).json({ status: 404, success: false, msg: "Nível acadêmico não encontrado." });
    }

    const currentNormalized = normalize(currentTitleResult[0].ed_academic_level_title);
    const newNormalized = normalize(academic_level_title);

    // Se o nome mudou, verificar se já existe similar
    if (currentNormalized !== newNormalized) {
      const checkQuery = `
        SELECT ed_academic_level_id FROM eduall_academic_level 
        WHERE 
          LOWER(REPLACE(REPLACE(REPLACE(ed_academic_level_title, ' ', ''), 'ª', ''), 'º', '')) = LOWER(REPLACE(REPLACE(REPLACE(?, ' ', ''), 'ª', ''), 'º', ''))
          AND ed_academic_level_institute_code = ?
          AND ed_academic_level_deleted = 0
          AND ed_academic_level_id != ?
      `;
      const checkParams = [academic_level_title.trim(), instituteCode, ID];

      const existing = await ExecuteQuery(res, checkQuery, checkParams, true, {
        db: "eduall_academic_level",
        type: "select",
        data: req,
      });

      if (existing.length > 0) {
        return res.status(400).json({
          status: 400,
          success: false,
          msg: `Já existe um nível acadêmico com um nome muito similar. Por favor, utilize um nome diferente.`,
        });
      }
    }

    // Atualizar
    const query = `UPDATE eduall_academic_level SET 
      ed_academic_level_title = ?, ed_academic_level_forExam = ?, ed_academic_level_forFt = ? 
      WHERE ed_academic_level_deleted = 0 AND ed_academic_level_id = ? AND ed_academic_level_institute_code = ?`;
    const PARAMS = [
      academic_level_title,
      academic_level_forExam,
      academic_level_forFt,
      ID,
      instituteCode,
    ];

    const rows = await ExecuteQuery(res, query, PARAMS, false, {
      db: "eduall_academic_level",
      type: "update",
      data: req,
    });

    await RegisterAuditAction({
      session: req.session,
      action: 2,
      form: "Níveis acadêmico",
      description: `Atualizou o nível acadêmico (${academic_level_title}) com ID ${ID}`,
    });

    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ success: false, message: "Falha ao atualizar o nível acadêmico!", error: error.message });
  }
};



c - cursos :



const RegisterCourse = async (req, res) => {
   try {
      const { course_title, course_category } = req.body;
      const courseTitleLowerCase = course_title.trim().toLowerCase();
    
      const checkQuery = `
        SELECT * FROM eduall_courses 
        WHERE LOWER(ed_course_title) = ? AND ed_course_deleted = 0 
        AND ed_course_institute_code = ?
      `;
      const checkParams = [courseTitleLowerCase, req.session.user.eduall_user_session_curentinstitute];
      const existingCourse = await ExecuteQuery(res, checkQuery, checkParams, true, {
        db: "eduall_courses",
        type: "select",
        data: req
      });
    
      if (existingCourse.length > 0) {
        return res.status(400).json({
          success: false,
          msg: "Já existe um curso com o mesmo nome!"
        });
      }
    
      const query = `INSERT INTO eduall_courses (ed_course_title, ed_course_category, ed_course_institute_code) VALUES(?, ?, ?)`;
      const PARAMS = [course_title, course_category, req.session.user.eduall_user_session_curentinstitute];
      const rows = await ExecuteQuery(res, query, PARAMS, false, {
        db: "eduall_courses",
        type: "insert",
        data: req
      });
    
      await RegisterAuditAction({
        session: req.session,
        action: 1,
        form: "Cursos",
        description: `Registrou um novo curso (${course_title})`,
      });
    
      res.status(200).json(rows);
    } catch (error) {
      res.status(500).json({
        success: false,
        msg: "Falha ao registrar o curso!",
        error: error.message
      });
    }
      
};

const CourseDelete = async (req, res) => {
   try {
      const { ID } = req.params;
      const institute = req.session.user.eduall_user_session_curentinstitute;

      const checkQuery = `SELECT COUNT(*) AS total FROM eduall_class 
                          WHERE ed_class_course = ? AND ed_class_institute_code = ? AND ed_class_deleted = 0`;
      const checkParams = [ID, institute];
      const checkResult = await ExecuteQuery(res, checkQuery, checkParams, true, {
         db: "eduall_class",
         type: "select",
         data: req,
      });

      const classCount = checkResult[0]?.total || 0;

      if (classCount > 0) {
         return res.status(400).json({
            success: false,
            msg: `Não é possível eliminar. Existem ${classCount} turmas ainda associadas a este curso.`,
         });
      }

      const query = `UPDATE eduall_courses SET ed_course_deleted = 1 
                     WHERE ed_course_deleted = 0 AND ed_course_id = ? AND ed_course_institute_code = ?`;
      const PARAMS = [ID, institute];
      const rows = await ExecuteQuery(res, query, PARAMS, false, {
         db: "eduall_courses",
         type: "update",
         data: req,
      });

      await RegisterAuditAction({
         session: req.session,
         action: 3,
         form: "Cursos",
         description: `Eliminou o curso com ID ${ID}`,
      });

      res.status(200).json(rows);
   } catch (error) {
      res.status(500).json({
         success: false,
         msg: "Falha ao eliminar o curso!",
         error: error.message,
      });
   }
};

const CourseUpdate = async (req, res) => {
   try {
      const { ID } = req.params;
      const { course_title, course_category } = req.body;
    
      const courseTitleLowerCase = course_title.trim().toLowerCase();
    
      // Verificar se já existe um curso com o mesmo nome
      const checkQuery = `
        SELECT * FROM eduall_courses 
        WHERE LOWER(ed_course_title) = ? AND ed_course_deleted = 0 
        AND ed_course_institute_code = ? AND ed_course_id != ?
      `;
      const checkParams = [courseTitleLowerCase, req.session.user.eduall_user_session_curentinstitute, ID];
      const existingCourse = await ExecuteQuery(res, checkQuery, checkParams, true, {
        db: "eduall_courses",
        type: "select",
        data: req
      });
    
      if (existingCourse.length > 0) {
        return res.status(400).json({
          success: false,
          msg: "Já existe um curso com o mesmo nome!"
        });
      }
    
      // Se não houver curso com o mesmo nome, proceder com a atualização
      const query = `
        UPDATE eduall_courses SET ed_course_title = ?, ed_course_category = ? 
        WHERE ed_course_deleted = 0 AND ed_course_id = ? AND ed_course_institute_code = ?
      `;
      const PARAMS = [course_title, course_category, ID, req.session.user.eduall_user_session_curentinstitute];
      const rows = await ExecuteQuery(res, query, PARAMS, false, {
        db: "eduall_courses",
        type: "update",
        data: req
      });
    
      // Registrar ação de auditoria
      await RegisterAuditAction({
        session: req.session,
        action: 2,
        form: "Cursos",
        description: `Atualizou o curso (${course_title}) da categoria ${course_category} com ID ${ID}`,
      });
    
      res.status(200).json(rows);
    } catch (error) {
      res.status(500).json({
        success: false,
        msg: "Falha ao atualizar o curso!",
        error: error.message
      });
    }
    
    
};


d - funcionarios :




const RegisterEmployee = async (req, res) => {
   try {
       const query = `INSERT INTO eduall_employees(ed_employee_name, ed_employee_address, ed_employee_nacionality, ed_employee_naturalness, 
       ed_employee_gender, ed_employee_religion, ed_employee_birthday, ed_employee_phone,  ed_employee_phone2, ed_employee_nif, ed_employee_email,
       ed_employee_civil_state, ed_employee_code, ed_employee_picture, ed_employee_identityCard, ed_employee_charge, 
       ed_employee_subjects, ed_employee_status, ed_employee_institute_code) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;

       const PARAMS = [req.body.employee_name, req.body.employee_address, req.body.employee_nacionality, req.body.employee_naturalness, 
       req.body.employee_gender, req.body.employee_religion, req.body.employee_birthday, req.body.employee_phone,
       req.body.employee_landline, req.body.employee_nif, req.body.employee_email, req.body.employee_civil_state, req.body.employee_code,
       (req.file ? "images/employees/" + req.file.filename : ""), req.body.employee_identityCard,  
       req.body.employee_charge, req.body.employee_subjects, req.body.employee_status, req.session.user.eduall_user_session_curentinstitute];
       
       const rows = await ExecuteQuery(res, query, PARAMS, false, { db: "eduall_employees", type: "insert", data: req });

       // Register Audit Action
       await RegisterAuditAction({
         session: req.session,
         action: 1,  // Ação de registro
         form: "Funcionários",
         description: `Registrou um novo funcionário (${req.body.employee_name}) com o código ${req.body.employee_code}`,
       });

       res.status(200).json(rows);
   } catch (error) {
       res.status(500).json({ success: false, message: "Failed to register employee!", error: error.message });
   }
}

const EmployeeDelete = async (req, res) => {
   try {
       const { ID } = req.params;
       const query = `UPDATE eduall_employees SET ed_employee_deleted = 1 WHERE ed_employee_deleted = 0 AND ed_employee_id = ?`;
       const PARAMS = [ID];
       const rows = await ExecuteQuery(res, query, PARAMS, false, { db: "eduall_employees", type: "update", data: req });

       // Register Audit Action
       await RegisterAuditAction({
         session: req.session,
         action: 3,  // Ação de eliminação
         form: "Funcionários",
         description: `Eliminou o funcionário com ID ${ID}`,
       });

       res.status(200).json(rows);
   } catch (error) {
       res.status(500).json({ success: false, message: "Failed to delete employee!", error: error.message });
   }
}

const EmployeeUpdate = async (req, res) => {
   try {
       const { ID } = req.params;
       const { employee_name, employee_nacionality, employee_nif, employee_gender, employee_charge, ed_employee_religion, employee_naturalness , employee_birthday, employee_subjects
       , employee_status, employee_address, employee_religion, employee_email, employee_civil_state, employee_identityCard, employee_landline, employee_phone } = req.body;

       
       let query = ``; 
       let PARAMS = [];

       if (req.file && req.file.filename) {
         query = `UPDATE eduall_employees SET ed_employee_name = ?, ed_employee_address = ?, ed_employee_nacionality = ?, ed_employee_naturalness = ?, 
        ed_employee_gender = ?, ed_employee_religion = ?, ed_employee_birthday = ?, ed_employee_phone = ?, ed_employee_phone2 = ?, ed_employee_nif = ?, 
        ed_employee_email = ?, ed_employee_civil_state = ?, ed_employee_identityCard = ?, ed_employee_charge = ?, ed_employee_subjects = ?, 
        ed_employee_status = ?,  ed_employee_picture = ? WHERE ed_employee_id = ? AND ed_employee_institute_code = ?`;
 
         PARAMS = [employee_name, employee_address, employee_nacionality, employee_naturalness, employee_gender, ed_employee_religion, employee_birthday, 
        employee_phone, employee_landline, employee_nif, employee_email, employee_civil_state, employee_identityCard, employee_charge, employee_subjects, 
        employee_status,  (req.file ? "images/employees/" + req.file.filename : ""), ID, req.session.user.eduall_user_session_curentinstitute];
       } else {
         query = `UPDATE eduall_employees SET ed_employee_name = ?, ed_employee_address = ?, ed_employee_nacionality = ?, ed_employee_naturalness = ?, 
        ed_employee_gender = ?, ed_employee_religion = ?, ed_employee_birthday = ?, ed_employee_phone = ?, ed_employee_phone2 = ?, ed_employee_nif = ?, 
        ed_employee_email = ?, ed_employee_civil_state = ?, ed_employee_identityCard = ?, ed_employee_charge = ?, ed_employee_subjects = ?, 
        ed_employee_status = ? WHERE ed_employee_id = ? AND ed_employee_institute_code = ?`;
 
         PARAMS = [employee_name, employee_address, employee_nacionality, employee_naturalness, employee_gender, ed_employee_religion, employee_birthday, 
        employee_phone, employee_landline, employee_nif, employee_email, employee_civil_state, employee_identityCard, employee_charge, employee_subjects, 
        employee_status, ID, req.session.user.eduall_user_session_curentinstitute];
       }
       
       const rows = await ExecuteQuery(res, query, PARAMS, false, { db: "eduall_employees", type: "update", data: req });

       // Register Audit Action
       await RegisterAuditAction({
         session: req.session,
         action: 2,  // Ação de atualização
         form: "Funcionários",
         description: `Atualizou os dados do funcionário com ID ${ID}`,
       });

       res.status(200).json(rows);
   } catch (error) {
       res.status(500).json({ success: false, message: "Failed to update employee!", error: error.message });
   }
}


//  associar o ed_employee_charge  a eduall_job_titles WHERE ed_job_title_id , caso não encontre charge sera não atribuido
const Getemployees = async (req, res) => {
  try {
    const query = `
      SELECT 
        e.*,
        u.ed_user_account_email,
        CASE 
          WHEN u.ed_user_account_email IS NOT NULL THEN 1 
          ELSE 0 
        END AS has_active_account,
        COALESCE(j.ed_job_title, 'Não atribuído') AS job_title
      FROM eduall_employees e
      LEFT JOIN eduall_user_accounts u 
        ON u.ed_user_account_email = e.ed_employee_email
      LEFT JOIN eduall_job_titles j
        ON j.ed_job_title_id = e.ed_employee_charge
      WHERE e.ed_employee_deleted = 0 
        AND e.ed_employee_institute_code = ?
      ORDER BY e.ed_employee_name ASC
    `;

    const PARAMS = [req.session.user.eduall_user_session_curentinstitute];

    const rows = await ExecuteQuery(res, query, PARAMS, true, { 
      db: "eduall_employees", 
      type: "select", 
      data: req 
    });

    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch employees!", 
      error: error.message 
    });
  }
};

e - envio de smss:


const SendSms = async (req, res) => { 
  const { phone, message, usertype, contact } = req.body;
  try {   
      const calculateSmsParts = (message) => {
      const maxChars = 160;
      const specialCharMaxChars = 70;
      const isSpecialChar = /[^\x00-\x7F]/.test(message);   
      const maxMessageLength = isSpecialChar ? specialCharMaxChars : maxChars; 
      return Math.ceil(message.length / maxMessageLength);   
  };
  
  try { 
      const query3 = `SELECT * FROM eduall_sms_credits WHERE ed_sms_credit_institute_code = ?`;
      const PARAMS3 = [req.session.user.eduall_user_session_curentinstitute]; 
      const rows = await ExecuteQuery(res, query3, PARAMS3, true, { db: "eduall_sms_credits", type: "select", data: req });
  
      if (!rows || rows.length === 0) {
          await RegisterSentMessage(1, message);
          return res.status(400).json({ status: 300, success: false, error: false, msg: "Créditos não encontrados!" });
      }
  
      const currentCredits = rows[0].ed_sms_credit_total * 1; 
      const smsParts = calculateSmsParts(message); 
      if (currentCredits < smsParts) {
          await RegisterSentMessage(1, message);
          return res.status(400).json({ status: 300, success: false, error: false, msg: "Os seus créditos não são suficientes para enviar a mensagem!" });
      }
  
      console.log("📤 Validando número...");
      const numeroFormatado = phone.replace(/\s+/g, ''); 
      const isValido = /^9\d{8}$/.test(numeroFormatado);  
   
      if (!isValido) {
          console.error("⚠️ Número inválido. O número deve começar com 9 e ter 9 dígitos.");
          await RegisterSentMessage(1, message);   
          return res.status(400).json({ status: 300, success: false, error: true, msg: "Número inválido!" });
      }
  
      console.log("📤 Enviando mensagem...");
  
      const message_body = `${message}`;
      const hasLink = /(https?:\/\/[^\s]+)/gi.test(message);
      if (hasLink) {
         return res.status(400).json({ status: 300, success: false, msg: "Não é permitido enviar mensagens com links!" });
      }
  
      const { status, data } = await axios.post("https://www.telcosms.co.ao/send_message", {
          message: { 
              api_key_app:"prdd0cf231ad82fcfa9c4c8654742",  
              phone_number: phone,  
              message_body
          }
      }, { headers: { "Content-Type": "application/json" } });
  
      console.log("✅ Resposta da API:", data);
   
      if (status === 200 || status === 201) {
          await RegisterAndUpdate(message_body);
          return res.status(200).json({ success: true, msg: "Mensagem enviada com sucesso!" });
      }
  
      console.error("⚠️ Falha ao enviar mensagem. Status:", status);
      await RegisterSentMessage(1, message_body);
      return res.status(400).json({ status: 300, success: false, error: true, msg: "Falha ao enviar a mensagem!" });
  
  } catch (error) {
      console.error("❌ Erro ao enviar mensagem:", error.message);
      await RegisterSentMessage(1, message);
      return res.status(500).json({ success: false, msg: "Erro interno ao enviar a mensagem!" });
  } 
  } catch (error) {
      return res.status(400).json({ status: 300, success: false, error: true, msg: error.message });
  }
 
  async function RegisterAndUpdate(message) {
    try {
        const message_body = `${message}`;
        
        const calculateSmsParts = (message) => {
            const maxChars = 160;
            const specialCharMaxChars = 70;
            const isSpecialChar = /[^\x00-\x7F]/.test(message);
            const maxMessageLength = isSpecialChar ? specialCharMaxChars : maxChars;
            return Math.ceil(message.length / maxMessageLength);
        };

        const smsParts = calculateSmsParts(message_body);
        await RegisterSentMessage(0, message_body);

        const query0 = `UPDATE eduall_sms_credits
                        SET ed_sms_credit_total = ed_sms_credit_total - ? 
                        WHERE ed_sms_credit_institute_code = ? AND ed_sms_credit_total >= ?`;

        const PARAMS0 = [smsParts, req.session.user.eduall_user_session_curentinstitute, smsParts];
        await ExecuteQuery(res, query0, PARAMS0, false, { db: "eduall_sms_credits", type: "update", data: req });
    } catch (error) {
        console.error("Erro ao atualizar créditos:", error.message);
    }
}


 
  async function RegisterSentMessage(status, message) {
      const query = `INSERT INTO eduall_sms_records(ed_sms_record_message, ed_sms_sent_to, ed_sms_record_sent_usertype, 
          ed_sms_sent_contactid, ed_sms_record_status, ed_sms_record_instituteCode) VALUES (?, ?, ?, ?, ?, ?)`;
      const PARAMS = [message, phone, usertype, contact, status, req.session.user.eduall_user_session_curentinstitute];
      await ExecuteQuery(res, query, PARAMS, false, { db: "eduall_sms_records", type: "insert", data: req });
  }
};





f -envio de email:



const { MailOptions } = require("../Functions/MailOptions");
 

 const SendEmailMessage= async(req, res)=>{  
      try { 
        const Email  =  req.body.Email;
        const Message = req.body.Message;
        const Header = req.body.Header;
        const Name = req.body.Name;
        const Title = req.body.Title; 
 

        const transporter = nodeMailer.createTransport(MailOptions());
     
        const info = await transporter.sendMail({
               from:"noreply@eduall.ao",
               to:Email,
               subject:Title, 
               html:`
               <!DOCTYPE html>
                <html lang="pt">
         
    
            
                </body>
               </html> ` 
        });


        res.status(200).json("success");  

      } catch (error) {
           res.status(400).json(error); 
           console.log(error);
      }
}


quero o code do fornten em um unico local e code do servidor em um unico ficheiro.


 */}


import React, { useState } from 'react'
import SelectDropdown from '@/components/shared/SelectDropdown'
import { currencyOptionsData } from '@/utils/fackData/currencyOptionsData'
import { FiCamera, FiInfo } from 'react-icons/fi'
import { BsCreditCardFill, BsPaypal } from 'react-icons/bs'
import { FaCcAmex, FaCcDinersClub, FaCcDiscover, FaCcJcb, FaCcMastercard, FaCcVisa } from 'react-icons/fa6'
import DatePicker from 'react-datepicker'
import useDatePicker from '@/hooks/useDatePicker'
import AddProposal from '../proposalEditCreate/AddProposal'
import useImageUpload from '@/hooks/useImageUpload'
import topTost from '@/utils/topTost'
import { invoiceTempletOptions } from './InvoiceView'
import Dropdown from '@/components/shared/Dropdown'

const previtems = [
    {
        id: 1,
        product: '',
        qty: 0,
        price: 0
    }
]
const InvoiceCreate = () => {
    const { startDate, endDate, setStartDate, setEndDate, renderFooter } = useDatePicker();
    const { handleImageUpload, uploadedImage } = useImageUpload()
    const [selectedOption, setSelectedOption] = useState(null)
    const [items, setItems] = useState(previtems);


    const addItem = () => {
        const newItem = {
            id: items.length + 1,
            product: '',
            qty: 1,
            price: 0
        };
        setItems([...items, newItem]);
    };

    const removeItem = () => {
        items.pop()

        setItems(items)
    }


    const handleInputChange = (id, field, value) => {
        const updatedItems = items.map(item => {
            if (item.id === id) {
                const updatedItem = { ...item, [field]: value };
                if (field === 'qty' || field === 'price') {
                    updatedItem.total = updatedItem.qty * updatedItem.price;
                }
                return updatedItem;
            }
            return item;
        });
        setItems(updatedItems);
    };

    const subTotal = items.reduce((accumulator, currentValue) => {
        return accumulator + (currentValue.price * currentValue.qty);
    }, 0);

    const vat = (subTotal * 0.1).toFixed(2)
    const vatNumber = Number(vat);
    const total = Number(subTotal + vatNumber).toFixed(2)

    const handleClick = () => {
        topTost()
    };
    return (
        <>
            <div className="col-xl-8">
                <div className="card invoice-container">
                    <div className="card-header">
                        <h5>Invoice Create</h5>
                        <Dropdown
                            dropdownItems={invoiceTempletOptions}
                            triggerClass='btn btn-light-brand dropdown-toggle'
                            triggerPosition={"0, 25"}
                            triggerText={"Invoice Templates"}
                            triggerIcon={" "}
                            isAvatar={false}
                            dropdownPosition='dropdown-menu-start'
                        />
                    </div>
                    <div className="card-body p-0">
                        <div className="px-4 pt-4">
                            <div className="d-md-flex align-items-center justify-content-between">
                                <div className="mb-4 mb-md-0 your-brand">
                                    <label htmlFor='img' className="wd-100 ht-100 mb-0 position-relative overflow-hidden border border-gray-2 rounded">
                                        <img src={uploadedImage || "/images/logo-abbr.png"} className="upload-pic img-fluid rounded h-100 w-100" alt="Uploaded" />
                                        <div className="position-absolute start-50 top-50 end-0 bottom-0 translate-middle h-100 w-100 hstack align-items-center justify-content-center c-pointer upload-button">
                                            <i aria-hidden="true" className='camera-icon'><FiCamera size={16} /></i>
                                        </div>
                                        <input className="file-upload" type="file" accept="image/*" id='img' hidden onChange={handleImageUpload} />
                                    </label>
                                    <div className="fs-12 text-muted">* Upload your brand</div>
                                </div>
                                <div className="d-md-flex align-items-center justify-content-end gap-4">
                                    <div className="form-group mb-3 mb-md-0">
                                        <label className="form-label">Issue Date:</label>
                                        <div className='input-group date '>
                                            <DatePicker
                                                placeholderText='Issue date...'
                                                selected={startDate}
                                                showPopperArrow={false}
                                                onChange={(date) => setStartDate(date)}
                                                className='form-control'
                                                popperPlacement="bottom-start"
                                                calendarContainer={({ children }) => (
                                                    <div className='bg-white react-datepicker'>
                                                        {children}
                                                        {renderFooter("start")}
                                                    </div>
                                                )}
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Due Date:</label>
                                        <div className='input-group date '>
                                            <DatePicker
                                                placeholderText='Due date...'
                                                selected={endDate}
                                                showPopperArrow={false}
                                                onChange={(date) => setEndDate(date)}
                                                className='form-control'
                                                popperPlacement="bottom-start"
                                                calendarContainer={({ children }) => (
                                                    <div className='bg-white react-datepicker'>
                                                        {children}
                                                        {renderFooter("end")}
                                                    </div>
                                                )}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <hr className="border-dashed" />
                        <div className="px-4 row justify-content-between">
                            <div className="col-xl-3">
                                <div className="form-group mb-3">
                                    <label htmlFor="InvoiceLabel" className="form-label">Invoice Label</label>
                                    <input type="text" className="form-control" id="InvoiceLabel" placeholder="Duralux Invoice" />
                                </div>
                            </div>
                            <div className="col-xl-3">
                                <div className="form-group mb-3">
                                    <label htmlFor="InvoiceNumber" className="form-label">Invoice Number</label>
                                    <input type="text" className="form-control" id="InvoiceNumber" placeholder="#NXL2023" />
                                </div>
                            </div>
                            <div className="col-xl-6">
                                <div className="form-group mb-3">
                                    <label htmlFor="InvoiceProduct" className="form-label">Invoice Product</label>
                                    <input type="text" className="form-control" id="InvoiceProduct" placeholder="Product Name" />
                                </div>
                            </div>
                        </div>
                        <hr className="border-dashed" />
                        <div className="row px-4 justify-content-between">
                            <div className="col-xl-5 mb-4 mb-sm-0">
                                <div className="mb-4">
                                    <h6 className="fw-bold">Invoice From:</h6>
                                    <span className="fs-12 text-muted">Send an invoice and get paid</span>
                                </div>
                                <div className="form-group row mb-3">
                                    <label htmlFor="InvoiceName" className="col-sm-3 col-form-label">Name</label>
                                    <div className="col-sm-9">
                                        <input type="text" className="form-control" id="InvoiceName" placeholder="Business Name" />
                                    </div>
                                </div>
                                <div className="form-group row mb-3">
                                    <label htmlFor="InvoiceEmail" className="col-sm-3 col-form-label">Email</label>
                                    <div className="col-sm-9">
                                        <input type="text" className="form-control" id="InvoiceEmail" placeholder="Email Address" />
                                    </div>
                                </div>
                                <div className="form-group row mb-3">
                                    <label htmlFor="InvoicePhone" className="col-sm-3 col-form-label">Phone</label>
                                    <div className="col-sm-9">
                                        <input type="text" className="form-control" id="InvoicePhone" placeholder="Enter Phone" />
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label htmlFor="InvoiceAddress" className="col-sm-3 col-form-label">Address</label>
                                    <div className="col-sm-9">
                                        <textarea rows={5} className="form-control" id="InvoiceAddress" placeholder="Enter Address" defaultValue={""} />
                                    </div>
                                </div>
                            </div>
                            <div className="col-xl-5">
                                <div className="mb-4">
                                    <h6 className="fw-bold">Invoice To:</h6>
                                    <span className="fs-12 text-muted">Send an invoice and get paid</span>
                                </div>
                                <div className="form-group row mb-3">
                                    <label htmlFor="ClientName" className="col-sm-3 col-form-label">Name</label>
                                    <div className="col-sm-9">
                                        <input type="text" className="form-control" id="ClientName" placeholder="Business Name" />
                                    </div>
                                </div>
                                <div className="form-group row mb-3">
                                    <label htmlFor="ClientEmail" className="col-sm-3 col-form-label">Email</label>
                                    <div className="col-sm-9">
                                        <input type="text" className="form-control" id="ClientEmail" placeholder="Email Address" />
                                    </div>
                                </div>
                                <div className="form-group row mb-3">
                                    <label htmlFor="ClientPhone" className="col-sm-3 col-form-label">Phone</label>
                                    <div className="col-sm-9">
                                        <input type="text" className="form-control" id="ClientPhone" placeholder="Enter Phone" />
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label htmlFor="ClientAddress" className="col-sm-3 col-form-label">Address</label>
                                    <div className="col-sm-9">
                                        <textarea rows={5} className="form-control" id="ClientAddress" placeholder="Enter Address" defaultValue={""} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <hr className="border-dashed" />
                        <div className="px-4 clearfix proposal-table" >
                            <div className="mb-4 d-flex align-items-center justify-content-between">
                                <div>
                                    <h6 className="fw-bold">Add Items:</h6>
                                    <span className="fs-12 text-muted">Add items to invoice</span>
                                </div>
                                <div className="avatar-text avatar-sm" data-bs-toggle="tooltip" data-bs-trigger="hover" title="Informations">
                                    <FiInfo />
                                </div>
                            </div>
                            <div className="table-responsive ">
                                <table className="table table-bordered overflow-hidden" id="tab_logic">
                                    <thead>
                                        <tr className="single-item">
                                            <th className="text-center">#</th>
                                            <th className="text-center wd-450">Product</th>
                                            <th className="text-center wd-150">Qty</th>
                                            <th className="text-center wd-150">Price</th>
                                            <th className="text-center wd-150">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            items.map(({ id, price, product, qty, total }, index) => {
                                                return (
                                                    <tr key={index}>
                                                        <td>{id}</td>
                                                        <td><input type="text" name="product" placeholder="Product Name" className="form-control" defaultValue={product} /></td>
                                                        <td><input type="number" name="qty" placeholder="Qty" className="form-control qty" step="1" min="1" defaultValue={qty} onChange={(e) => handleInputChange(id, 'qty', parseInt(e.target.value))} /></td>
                                                        <td><input type="number" name="price" placeholder="Unit Price" className="form-control price" step="1.00" min="1" defaultValue={price} onChange={(e) => handleInputChange(id, 'price', parseFloat(e.target.value))} /></td>
                                                        <td><input type="number" name="total" placeholder="0.00" className="form-control total" readOnly value={qty * price} /></td>
                                                    </tr>
                                                )
                                            })
                                        }
                                    </tbody>
                                </table>
                            </div>
                            <div className="d-flex justify-content-end gap-2 mt-3">
                                <button className="btn btn-sm bg-soft-danger text-danger" onClick={removeItem}>Delete</button>
                                <button className="btn btn-sm btn-primary" onClick={addItem}>Add Items</button>
                            </div>
                        </div>
                        <hr className="border-dashed" />
                        <div className="px-4 pb-4">
                            <div className="form-group">
                                <label htmlFor="InvoiceNote" className="form-label">Invoice Note:</label>
                                <textarea rows={6} className="form-control" id="InvoiceNote" placeholder="It was a pleasure working with you and your team. We hope you will keep us in mind for future freelance projects. Thank You!" defaultValue={""} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-xl-4">
                <div className="card stretch stretch-full">
                    <div className="card-body">
                        <div className="mb-4 d-flex align-items-center justify-content-between">
                            <div>
                                <h6 className="fw-bold">Grand Total:</h6>
                                <span className="fs-12 text-muted">Grand total invoice</span>
                            </div>
                            <div className="avatar-text avatar-sm" data-bs-toggle="tooltip" data-bs-trigger="hover" title="Grand total invoice">
                                <FiInfo />
                            </div>
                        </div>
                        <div className="table-responsive">
                            <table className="table table-bordered" id="tab_logic_total">
                                <tbody>
                                    <tr className="single-item">
                                        <th className="fs-10 text-dark text-uppercase">Sub Total</th>
                                        <td className="w-25"><input type="number" name="sub_total" placeholder="0.00" className="form-control border-0 bg-transparent p-0" id="sub_total" readOnly value={subTotal} /></td>
                                    </tr>
                                    <tr className="single-item">
                                        <th className="fs-10 text-dark text-uppercase">Tax</th>
                                        <td className="w-25">
                                            <div className="input-group mb-2 mb-sm-0">
                                                <input type="number" className="form-control border-0 bg-transparent p-0" id="tax" placeholder="0" defaultValue="10" />
                                                <div className="input-group-addon">%</div>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr className="single-item">
                                        <th className="fs-10 text-dark text-uppercase">Tax Amount</th>
                                        <td className="w-25"><input type="number" name="tax_amount" id="tax_amount" placeholder="0.00" className="form-control border-0 bg-transparent p-0" readOnly value={vat} /></td>
                                    </tr>
                                    <tr className="single-item">
                                        <th className="fs-10 text-dark text-uppercase bg-gray-100">Grand Total</th>
                                        <td className="bg-gray-100 w-25"><input type="number" name="total_amount" id="total_amount" placeholder="0.00" className="form-control border-0 bg-transparent p-0 fw-700 text-dark" readOnly value={total} /></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div className="card stretch stretch-full">
                    <div className="card-body">
                        <div className="mb-4 d-flex align-items-center justify-content-between">
                            <div>
                                <h6 className="fw-bold">Payment Methord:</h6>
                                <span className="fs-12 text-muted">Select payment methord</span>
                            </div>
                            <div className="avatar-text avatar-sm" data-bs-toggle="tooltip" data-bs-trigger="hover" title="Select payment methord">
                                <FiInfo />
                            </div>
                        </div>
                        {/* Nav tabs */}
                        <ul className="nav nav-justified gap-1">
                            <li className="nav-item border border-gray-500">
                                <a href="#" className="nav-link px-2 active d-flex align-items-center justify-content-center" data-bs-toggle="tab" data-bs-target="#pamymetDebitCardTab">
                                    <BsCreditCardFill />
                                    <span className="ms-2">Debit Card</span>
                                </a>
                            </li>
                            <li className="nav-item border border-gray-500">
                                <a href="#" className="nav-link px-2 d-flex align-items-center justify-content-center" data-bs-toggle="tab" data-bs-target="#pamymetPaypalTab">
                                    <BsPaypal />
                                    <span className="ms-2">Paypal</span>
                                </a>
                            </li>
                        </ul>
                        {/* Tab panes */}
                        <div className="tab-content mt-4">
                            <div className="tab-pane fade show active" id="pamymetDebitCardTab" role="tabpanel">
                                <div className="form-group mb-3">
                                    <input type="text" className="form-control input-credit-card" placeholder="Card Number" />
                                    <div className="hstack justify-content-end gap-1 mt-1 input-credit-card-type">
                                        <div className="amex">
                                            <FaCcAmex size={13} />
                                        </div>
                                        <div className="mastercard">
                                            <FaCcMastercard size={13} />
                                        </div>
                                        <div className="visa">
                                            <FaCcVisa size={13} />
                                        </div>
                                        <div className="discover">
                                            <FaCcDiscover size={13} />
                                        </div>
                                        <div className="jcb">
                                            <FaCcJcb size={13} />
                                        </div>
                                        <div className="diners">
                                            <FaCcDinersClub size={13} />
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group mb-3">
                                    <input type="text" className="form-control" placeholder="Card Holder Name" />
                                </div>
                                <div className="d-flex gap-3">
                                    <div className="form-group">
                                        <input type="text" className="form-control input-date-formatting" placeholder="MM/YYYY" />
                                    </div>
                                    <div className="form-group">
                                        <input type="text" className="form-control input-Blocks-formatting" placeholder={686} />
                                    </div>
                                </div>
                            </div>
                            <div className="tab-pane fade" id="pamymetPaypalTab" role="tabpanel">
                                <p>Paypal is easiest way to pay online</p>
                                <p>
                                    <a href="http://paypal.com" target="_blank" className="btn btn-primary"><i className="bi bi-paypal me-2" /> Log in my Paypal</a>
                                </p>
                                <div className="fs-11 text-muted">Note: There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words.</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="card stretch stretch-full">
                    <div className="card-body">
                        <div className="mb-4 d-flex align-items-center justify-content-between">
                            <div>
                                <h6 className="fw-bold">Currency &amp; Discount:</h6>
                                <span className="fs-12 text-muted">Calculate your currency, tax &amp; discount</span>
                            </div>
                            <div className="avatar-text avatar-sm" data-bs-toggle="tooltip" data-bs-trigger="hover" title="Calculate your currency, tax & discount">
                                <FiInfo />
                            </div>
                        </div>
                        <div className="form-group mb-4">
                            <SelectDropdown
                                options={currencyOptionsData}
                                selectedOption={selectedOption}
                                defaultSelect="usd"
                                onSelectOption={(option) => setSelectedOption(option)}
                            />
                        </div>
                        <div className="form-group mb-4">
                            <input type="number" id="itemDiscount" className="form-control" placeholder="Discount" />
                        </div>
                        <div className="ps-0 mb-3 form-check form-switch form-switch-sm d-flex align-center justify-content-between">
                            <label className="fw-bold text-dark" htmlFor="LateFees">
                                <span>Late Fees</span>
                                <span className="fs-11 fw-normal text-muted d-block">Late fees for extra charge</span>
                            </label>
                            <input className="form-check-input" type="checkbox" id="LateFees" defaultChecked="checked" />
                        </div>
                        <div className="ps-0 mb-3 form-check form-switch form-switch-sm d-flex align-center justify-content-between">
                            <label className="fw-bold text-dark" htmlFor="ClientNote">
                                <span>Client Notes</span>
                                <span className="fs-11 fw-normal text-muted d-block">Client notes for further query</span>
                            </label>
                            <input className="form-check-input" type="checkbox" id="ClientNote" />
                        </div>
                        <div className="ps-0 form-check form-switch form-switch-sm d-flex align-center justify-content-between">
                            <label className="fw-bold text-dark" htmlFor="SavePayment">
                                <span>Save Payment</span>
                                <span className="fs-11 fw-normal text-muted d-block">Save payment for quick payout</span>
                            </label>
                            <input className="form-check-input" type="checkbox" id="SavePayment" />
                        </div>
                    </div>
                </div>
                <div className="card stretch stretch-full">
                    <div className="card-body">
                        <div className="mb-4 d-flex align-items-center justify-content-between">
                            <div>
                                <h6 className="fw-bold">Cancel Invoce</h6>
                                <span className="fs-12 text-muted">Cancel invoice for ever.</span>
                            </div>
                            <a href="#" className="btn btn-light-brand">Nevermind</a>
                        </div>
                        <p className="fs-12 text-muted mb-4">Are you sure you want to cancel this invoice? Neigther you nor alex will able to make any(more) payments on it.</p>
                        <div className="custom-control custom-checkbox">
                            <input type="checkbox" className="custom-control-input" id="notifyMe" defaultChecked />
                            <label className="custom-control-label c-pointer" htmlFor="notifyMe">Notify alex that this invoice was cancelled.</label>
                        </div>
                        <a href="#" className="btn bg-soft-danger text-danger mt-4" onClick={handleClick}>Cancel this Invoice</a>
                    </div>
                </div>
            </div>
        </>
    )
}

export default InvoiceCreate