import { execSync } from 'child_process';
import fs from 'fs';

console.log('🚀 Iniciando Sincronização Total com GitHub...');

const run = (command) => {
  try {
    // stdio: 'inherit' permite ver a saída do git no console em tempo real
    execSync(command, { stdio: 'inherit' });
    return true;
  } catch (e) {
    console.warn(`⚠️  Aviso no comando: ${command}`);
    return false;
  }
};

const checkGit = () => {
  try {
    execSync('git --version', { stdio: 'ignore' });
  } catch (e) {
    console.error('❌ Git não está instalado ou não está no PATH.');
    process.exit(1);
  }
};

// 1. Verifica Instalação do Git
checkGit();

// 2. Inicializa se necessário
if (!fs.existsSync('.git')) {
  console.log('📦 Inicializando repositório Git...');
  run('git init');
  run('git branch -M main');
}

// 3. Garante .gitignore (Fallback se o arquivo não tiver sido criado)
if (!fs.existsSync('.gitignore')) {
  console.log('📄 Criando .gitignore de emergência...');
  fs.writeFileSync('.gitignore', 'node_modules\n.next\n.env\ndist\nbuild\n.vercel\n');
}

// 4. Verifica Remoto
try {
  const remotes = execSync('git remote -v', { encoding: 'utf8' });
  if (!remotes.includes('origin')) {
    console.error('\n⚠️  ERRO CRÍTICO: Nenhum repositório remoto configurado.');
    console.log('👉 Execute no terminal agora: git remote add origin SEU_LINK_DO_GITHUB_AQUI');
    console.log('   Exemplo: git remote add origin https://github.com/usuario/projeto.git');
    process.exit(1);
  }
} catch (e) {
  // Ignora erro se git init acabou de rodar
}

// 5. Fluxo de Sincronização
console.log('📦 Adicionando TODOS os arquivos...');
run('git add .');

const date = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
console.log(`💾 Commitando alterações (${date})...`);
run(`git commit -m "Backup Completo: Sincronização em ${date}"`);

console.log('⬆️  Enviando para o GitHub (Push)...');
const success = run('git push -u origin main');

if (!success) {
  console.log('\n⚠️  Push padrão falhou. Tentando Push Forçado (Atualizar remoto com local)...');
  const forceSuccess = run('git push -u origin main --force');
  
  if (forceSuccess) {
    console.log('\n✅ Sincronização Forçada Concluída!');
  } else {
    console.error('\n❌ Erro ao enviar. Verifique se você tem permissão no repositório ou se o link está correto.');
  }
} else {
  console.log('\n✅ Sincronização Concluída com Sucesso!');
}