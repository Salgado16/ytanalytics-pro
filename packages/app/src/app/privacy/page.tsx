import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Política de Privacidade | YTAnalytics Pro",
  description: "Política de privacidade do YTAnalytics Pro",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="mx-auto max-w-3xl space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Política de Privacidade</h1>
          <p className="text-sm text-muted-foreground">Última atualização: 19 de setembro de 2026</p>
        </div>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">1. Visão geral</h2>
          <p className="text-muted-foreground leading-relaxed">
            O YTAnalytics Pro ("nós", "nosso" ou "aplicativo") é uma plataforma de análise e crescimento voltada
            para criadores de conteúdo do YouTube. Esta política explica quais informações coletamos, como as
            utilizamos, armazenamos e protegemos, e quais são os seus direitos. Ao utilizar o aplicativo, você
            concorda com as práticas descritas neste documento.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">2. Dados que coletamos</h2>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground leading-relaxed">
            <li>
              <strong>Dados da conta Google:</strong> quando você faz login com o Google, coletamos seu nome,
              endereço de e-mail e foto de perfil.
            </li>
            <li>
              <strong>Dados do YouTube:</strong> com sua autorização via OAuth, acessamos informações dos seus
              canais (título, inscritos, visualizações), vídeos, métricas do YouTube Analytics, vídeos salvos como
              referência e conteúdo que você cria usando nossas ferramentas.
            </li>
            <li>
              <strong>Dados criados no aplicativo:</strong> ideias, projetos, transcrições, mídias salvas e
              preferências que você produz ao usar as funcionalidades.
            </li>
            <li>
              <strong>Dados de uso:</strong> registros de acesso (IP, data/hora, páginas visitadas) utilizados
              para segurança e melhoria do serviço.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">3. Como utilizamos seus dados</h2>
          <p className="text-muted-foreground leading-relaxed">
            Utilizamos os dados coletados para: fornecer e operar as funcionalidades do aplicativo (dashboard,
            análise de canais, ferramentas de crescimento e conteúdo), autenticar sua conta, gerar relatórios e
            recomendações, garantir segurança, e melhorar nossos serviços.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            O uso das informações recebidas das APIs do YouTube pelo YTAnalytics Pro está em conformidade com os{" "}
            <a
              href="https://developers.google.com/youtube/terms/api-services-terms-of-service"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Termos de Serviço das APIs do YouTube
            </a>{" "}
            e com a{" "}
            <a
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Política de Privacidade do Google
            </a>
            .
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">4. Compartilhamento de dados</h2>
          <p className="text-muted-foreground leading-relaxed">
            Não vendemos seus dados pessoais. Podemos compartilhar informações com provedores de serviços que
            nos ajudam a operar o aplicativo (hospedagem, banco de dados, monitoramento), sempre sujeitos a
            obrigações de confidencialidade. Durante o uso de recursos específicos (por exemplo, busca de mídia
            ou geração de texto via IA), algumas informações podem ser enviadas a fornecedores terceiros
            (Pixabay, Pexels, provedores de IA) exclusivamente para executar a ação solicitada por você.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">5. Armazenamento e segurança</h2>
          <p className="text-muted-foreground leading-relaxed">
            Seus dados são armazenados em servidores seguros com criptografia em trânsito (SSL/TLS) e em repouso.
            Utilizamos boas práticas de segurança (JWT, refresh tokens, controle de acesso) para proteger sua
            conta. Nenhum método de transmissão ou armazenamento é 100% seguro; não podemos garantir segurança
            absoluta.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">6. Retenção e exclusão</h2>
          <p className="text-muted-foreground leading-relaxed">
            Mantemos seus dados enquanto sua conta estiver ativa ou pelo tempo necessário para cumprir
            obrigações legais. Você pode solicitar a exclusão da sua conta e dos seus dados a qualquer momento
            pelo e-mail de contato abaixo. Ao revogar o acesso do Google ao aplicativo, interrompemos novas
            coletas de dados do YouTube.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">7. Cookies e sessões</h2>
          <p className="text-muted-foreground leading-relaxed">
            Utilizamos cookies de sessão e tokens de autenticação para manter você conectado e personalizar sua
            experiência. Você pode desabilitar cookies no seu navegador, mas algumas funcionalidades podem não
            funcionar corretamente.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">8. Seus direitos</h2>
          <p className="text-muted-foreground leading-relaxed">
            Em conformidade com a LGPD (Lei Geral de Proteção de Dados do Brasil), você tem direito a: acessar,
            corrigir, portar, limitar o tratamento e solicitar a exclusão dos seus dados. Você também pode
            revogar o consentimento concedido ao aplicativo nas configurações da sua conta Google.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">9. Alterações nesta política</h2>
          <p className="text-muted-foreground leading-relaxed">
            Podemos atualizar esta política periodicamente. Alterações relevantes serão notificadas pelo
            aplicativo. O uso continuado após a publicação de alterações constitui aceitação das novas regras.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">10. Contato</h2>
          <p className="text-muted-foreground leading-relaxed">
            Dúvidas sobre esta política podem ser enviadas para o e-mail de contato disponível na página{" "}
            <Link href="/settings" className="text-primary hover:underline">
              Configurações
            </Link>
            .
          </p>
        </section>

        <p className="text-sm text-muted-foreground">
          Documento elaborado em 19 de setembro de 2026.
        </p>
      </div>
    </div>
  );
}