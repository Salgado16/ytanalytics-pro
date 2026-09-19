import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Termos de Serviço | YTAnalytics Pro",
  description: "Termos de serviço do YTAnalytics Pro",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="mx-auto max-w-3xl space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Termos de Serviço</h1>
          <p className="text-sm text-muted-foreground">Última atualização: 19 de setembro de 2026</p>
        </div>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">1. Aceitação dos termos</h2>
          <p className="text-muted-foreground leading-relaxed">
            Ao acessar ou utilizar o YTAnalytics Pro ("serviço"), você concorda com estes Termos de Serviço. Se
            você não concorda com qualquer parte destes termos, não utilize o serviço.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">2. Descrição do serviço</h2>
          <p className="text-muted-foreground leading-relaxed">
            O YTAnalytics Pro fornece ferramentas de análise de canais e vídeos do YouTube, inclui dashboard de
            métricas, detecção de vídeos virais, busca de nichos, gestão de ideias, banco de mídia, geração de
            texto via IA, transcrições e conversão de texto em fala. O serviço depende de conexão com a internet
            e de APIs de terceiros (Google/YouTube, Pixabay, Pexels e outros).
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">3. Conta e autenticação</h2>
          <p className="text-muted-foreground leading-relaxed">
            Para usar o serviço, você faz login com sua conta Google. Você é responsável por manter a
            confidencialidade das suas credenciais e por todas as atividades que ocorrerem na sua conta. Ao
            autorizar o acesso, você concede ao serviço as permissões solicitadas sobre os seus dados do YouTube.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">4. Uso responsável</h2>
          <p className="text-muted-foreground leading-relaxed">Você se compromete a:</p>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground leading-relaxed">
            <li>Fornecer informações verdadeiras e utilizá-las apenas para fins legítimos;</li>
            <li>Não violar direitos autorais, marcas ou propriedade intelectual de terceiros;</li>
            <li>Não usar o serviço para atividades ilícitas, fraudulentas ou abusivas;</li>
            <li>Não tentar acessar, manipular ou extrair dados de outros usuários;</li>
            <li>Não revender, redistribuir ou explorar comercialmente o serviço sem autorização.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">5. Conteúdo do usuário</h2>
          <p className="text-muted-foreground leading-relaxed">
            Você mantém a propriedade do conteúdo que cria no serviço (ideias, textos, projetos, mídias
            favoritas). Ao criar conteúdo, você nos concede uma licença limitada para armazená-lo e exibi-lo
            dentro do serviço. Não reivindicamos propriedade sobre seus dados do YouTube.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">6. Serviços de terceiros</h2>
          <p className="text-muted-foreground leading-relaxed">
            O serviço integra APIs e serviços de terceiros (Google, YouTube, Pixabay, Pexels, provedores de IA,
            entre outros). O uso de tais serviços está sujeito aos respectivos termos e políticas. Não somos
            responsáveis por indisponibilidade, alterações ou conteúdo disponibilizado por terceiros.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Nosso uso das APIs do YouTube é regido pelos{" "}
            <a
              href="https://developers.google.com/youtube/terms/api-services-terms-of-service"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Termos de Serviço das APIs do YouTube
            </a>
            .
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">7. Disponibilidade e mudanças no serviço</h2>
          <p className="text-muted-foreground leading-relaxed">
            Podemos modificar, suspender, interromper ou descontinuar qualquer parte do serviço a qualquer
            momento, com ou sem aviso. Não garantimos que o serviço esteja sempre disponível, livre de erros ou
            ininterrupto. Métricas e análises são fornecidas com base nos dados disponíveis e podem apresentar
            divergências.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">8. Isenção de garantias</h2>
          <p className="text-muted-foreground leading-relaxed">
            O serviço é fornecido "no estado em que se encontra", sem garantias de qualquer natureza, expressas
            ou implícitas, incluindo garantias de comercialização, adequação a uma finalidade específica e não
            violação. Você assume todos os riscos decorrentes do uso do serviço, incluindo decisões tomadas com
            base em suas análises.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">9. Limitação de responsabilidade</h2>
          <p className="text-muted-foreground leading-relaxed">
            Na máxima extensão permitida por lei, o YTAnalytics Pro não será responsável por danos diretos,
            indiretos, incidentais, especiais, consequenciais ou punitivos, incluindo lucros cessantes, perda de
            dados ou interrupção de negócio, decorrentes do uso ou da impossibilidade de uso do serviço.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">10. Encerramento</h2>
          <p className="text-muted-foreground leading-relaxed">
            Você pode encerrar o uso do serviço a qualquer momento, excluindo sua conta ou deixando de acessá-lo.
            Podemos suspender ou encerrar seu acesso em caso de violação destes termos ou de comportamento abusivo,
            sem prejuízo de outras medidas legais.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">11. Legislação aplicável</h2>
          <p className="text-muted-foreground leading-relaxed">
            Estes termos são regidos pelas leis da República Federativa do Brasil, em especial a Lei Geral de
            Proteção de Dados (Lei nº 13.709/2018 - LGPD). Eventual controvérsia será submetida ao foro da comarca
            do desenvolvedor do serviço.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">12. Alterações destes termos</h2>
          <p className="text-muted-foreground leading-relaxed">
            Podemos revisar estes termos periodicamente. A versão vigente estará sempre disponível nesta página. O
            uso continuado do serviço após alterações constitui aceitação dos novos termos.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">13. Contato</h2>
          <p className="text-muted-foreground leading-relaxed">
            Dúvidas sobre estes termos podem ser enviadas para o e-mail de contato disponível na página{" "}
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