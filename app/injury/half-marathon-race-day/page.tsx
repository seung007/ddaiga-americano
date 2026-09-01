import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import YoutubeSection from "@/components/YoutubeSection";
import FaqSection from "@/components/FaqSection";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "하프마라톤 대회 당일 체크리스트 — 페이스·급수·젤·바세린 총정리 | 뛰다가 아메리카노",
  description:
    "하프마라톤 당일에 실제로 필요한 것만. 탄수화물 로딩이 하프에 필요한지, 젤은 언제 몇 개, 물은 얼마나, 바세린은 어디에. 논문 근거와 직접 뛰어본 경험을 구분해서 적었습니다.",
};

/**
 * 표시 체계 — 이 페이지의 핵심 설계
 *
 * 이 사이트의 다른 페이지는 전부 논문 근거로 굴러간다. 그런데 대회 당일 실전
 * 요령은 상당 부분 논문이 없다. 바세린을 어디에 바르는지 RCT를 한 사람은 없다.
 *
 * 그렇다고 빼면 정작 필요한 내용이 사라지고, 그렇다고 논문인 척하면
 * 2026-08에 인용 26건이 틀렸던 그 실패를 반복한다. 그래서 항목마다
 * **무게(필수/추천/취향)와 근거(논문/관행/경험)를 따로 표시**한다.
 * 읽는 사람이 스스로 가중치를 매길 수 있어야 한다.
 */
type Weight = "must" | "should" | "optional";
type Basis = "paper" | "practice" | "experience";

const WEIGHT_STYLE: Record<Weight, { label: string; cls: string }> = {
  must:     { label: "필수",  cls: "bg-red-100 text-red-700" },
  should:   { label: "추천",  cls: "bg-amber-100 text-amber-800" },
  optional: { label: "취향",  cls: "bg-gray-100 text-gray-600" },
};

const BASIS_STYLE: Record<Basis, { label: string; cls: string }> = {
  paper:      { label: "논문 근거", cls: "border-emerald-300 text-emerald-700 bg-emerald-50" },
  practice:   { label: "통용 관행", cls: "border-blue-200 text-blue-700 bg-blue-50" },
  experience: { label: "직접 경험", cls: "border-violet-200 text-violet-700 bg-violet-50" },
};

function Item({
  weight, basis, title, children,
}: {
  weight: Weight; basis: Basis; title: string; children: React.ReactNode;
}) {
  const w = WEIGHT_STYLE[weight];
  const b = BASIS_STYLE[basis];
  return (
    <div className="border border-gray-200 rounded-xl p-4">
      <div className="flex flex-wrap items-center gap-1.5 mb-2">
        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${w.cls}`}>{w.label}</span>
        <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${b.cls}`}>{b.label}</span>
        <span className="font-semibold text-gray-900 text-sm ml-0.5">{title}</span>
      </div>
      <div className="text-sm text-gray-700 leading-relaxed space-y-2">{children}</div>
    </div>
  );
}

export default function Page() {
  return (
    <>
      <SiteHeader />
      <article className="max-w-2xl mx-auto px-6 py-12 text-gray-800">
        <Link href="/injury" className="text-sm text-emerald-600 hover:underline mb-6 inline-block">
          ← 부상 예방 가이드
        </Link>

        <header className="mb-8">
          <span className="inline-block text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full mb-3">대회 실전</span>
          <h1 className="text-3xl font-bold text-gray-900 leading-tight mb-3">
            하프마라톤 대회 당일 체크리스트
          </h1>
          <p className="text-gray-500 text-sm mb-4">8분 읽기 · 21.1km 기준</p>
          <div className="inline-flex items-center gap-2 text-xs text-gray-500 bg-gray-50 border border-gray-200 rounded-full px-3 py-1.5">
            <span className="text-emerald-600">✓</span>
            협찬 없이 작성 — 논문 근거와 직접 경험을 항목마다 구분해 표시합니다
          </div>
        </header>

        {/* ── 표시 체계 안내 ── */}
        <section className="mb-8 p-5 bg-gray-50 rounded-2xl border border-gray-200">
          <h2 className="text-base font-bold text-gray-900 mb-3">이 페이지 읽는 법</h2>
          <p className="text-sm text-gray-700 leading-relaxed mb-3">
            대회 요령은 논문이 있는 것과 없는 것이 섞여 있습니다.
            <strong> 바세린을 어디에 바르는지 임상시험을 한 사람은 없습니다.</strong> 그렇다고 빼면
            정작 필요한 내용이 사라지고, 논문인 척하면 거짓이 됩니다. 그래서 두 가지를 따로 답니다.
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            <div>
              <p className="text-xs font-semibold text-gray-500 mb-1.5">얼마나 중요한가</p>
              <div className="flex flex-wrap gap-1.5">
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700">필수</span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">추천</span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">취향</span>
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 mb-1.5">뭘 근거로 하는가</p>
              <div className="flex flex-wrap gap-1.5">
                <span className="text-[11px] font-medium px-2 py-0.5 rounded-full border border-emerald-300 text-emerald-700 bg-emerald-50">논문 근거</span>
                <span className="text-[11px] font-medium px-2 py-0.5 rounded-full border border-blue-200 text-blue-700 bg-blue-50">통용 관행</span>
                <span className="text-[11px] font-medium px-2 py-0.5 rounded-full border border-violet-200 text-violet-700 bg-violet-50">직접 경험</span>
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-3 leading-relaxed">
            <strong>&lsquo;직접 경험&rsquo;은 한 사람의 표본 1입니다.</strong> 참고로 쓰되 논문 근거와 같은 무게로 읽지 마세요.
          </p>
        </section>

        {/* ── 국내 통념과 국제 합의가 갈리는 지점. 이 페이지에서 가장 중요한 부분 ── */}
        <section className="mb-8 p-5 bg-red-50 rounded-2xl border border-red-200">
          <h2 className="text-lg font-bold text-red-900 mb-3">
            먼저 — 급수에 대해 국내 통념과 국제 합의가 갈립니다
          </h2>
          <p className="text-sm text-red-900 leading-relaxed mb-3">
            국내 러닝 가이드에서 자주 보이는 조언이 있습니다.
            <strong>&ldquo;갈증을 느끼면 이미 탈수다. 목마르지 않아도 급수대마다 규칙적으로 마셔라.&rdquo;</strong>
          </p>
          <p className="text-sm text-red-900 leading-relaxed mb-3">
            <strong>2015년 국제 합의문은 이 조언을 폐기했습니다.</strong> 현재 권고는
            <strong> &ldquo;목마른 만큼 마셔라, 그 이상도 이하도 아니다&rdquo;</strong>입니다.
            갈증에 맞춰 마시게 했더니 저나트륨혈증이 거의 사라졌고, 완주 기록에도 손해가 없었다는 것이 근거입니다.
          </p>
          <p className="text-sm text-red-900 leading-relaxed mb-3">
            이유는 이렇습니다. 땀으로 나트륨이 빠진 상태에서 물을 필요 이상으로 마시면
            혈중 나트륨이 묽어집니다. 이게 <strong>운동유발 저나트륨혈증</strong>이고,
            심하면 의식 저하와 경련까지 갑니다.
            대회 현장에서 <strong>탈수보다 이쪽이 더 자주 문제가 됩니다.</strong>
          </p>
          <div className="rounded-xl bg-white/70 border border-red-200 p-3 mb-3">
            <p className="text-xs font-bold text-red-900 mb-1.5">달리는 중에 알아챌 수 있는 신호</p>
            <ul className="text-xs text-red-900 space-y-0.5 mb-2">
              <li>• 메스꺼움·구토, 깨질 듯한 두통</li>
              <li>• 머리가 멍하고 방향 감각이 흐려진다</li>
              <li>• 손발이 부어서 반지나 시계가 꽉 낀다</li>
            </ul>
            <p className="text-xs font-bold text-red-900 mb-1.5">완주 후에야 확인되는 신호</p>
            <ul className="text-xs text-red-900 space-y-0.5">
              <li>• 21km를 뛰고 왔는데 <strong>체중이 오히려 늘었다</strong></li>
            </ul>
            <p className="text-[11px] text-red-700 mt-2 leading-relaxed">
              체중은 코스에서 잴 수 없습니다. 달리는 중에는 위의 세 가지로 판단하고,
              하나라도 있으면 <b>물을 더 마시지 말고 의료진에게</b> 가세요.
              코스 의료진 위치는 대회 안내문에 표시돼 있으니 출발 전에 확인해두면 좋습니다.
            </p>
          </div>
          <div className="rounded-xl bg-white/70 border border-red-200 p-3 mb-3">
            <p className="text-xs font-bold text-red-900 mb-1.5">
              여기서 갈립니다 — 2시간 넘게 뛰는 더운 날이라면 위험의 무게가 반대입니다
            </p>
            <p className="text-xs text-red-900 leading-relaxed">
              90분 안에 들어오는 러너에게는 물을 필요 이상 마시는 쪽이 더 흔한 문제입니다.
              <strong>반대로 기온이 높고 완주에 2시간 이상 걸린다면 탈수·열탈진 위험이 더 크게 걸립니다.</strong>
              그 조건이면 갈증은 확실히 오고, <b>오면 참지 말고 마셔야 합니다.</b>
              이 절의 요점은 &ldquo;마시지 말라&rdquo;가 아니라
              <b>목이 마르지도 않은데 급수대 개수를 채우려 들이키지 말라</b>는 것입니다.
            </p>
          </div>
          <p className="text-xs text-red-700 leading-relaxed">
            <strong>위험군은 따로 있습니다.</strong> 신장 질환이 있거나, 이뇨제·일부 진통제를 복용 중이거나,
            체중이 가벼운 참가자는 저나트륨혈증 위험이 더 높다고 알려져 있습니다.
            해당된다면 <b>대회 전에 의사와 상의하세요.</b> 이 페이지의 일반 원칙으로 갈음하지 마세요.
          </p>
        </section>

        {/* ── 대회 2~3일 전 ── */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">대회 2~3일 전 — 탄수화물</h2>
          <div className="space-y-3">
            <Item weight="optional" basis="paper" title="하프에는 풀 카보로딩이 대체로 필요 없습니다">
              <p>
                몸에 저장된 글리코겐은 <strong>중강도 달리기 75~90분 분량</strong>입니다.
                하프를 90분 안에 끝낸다면 평소대로 먹어도 탱크는 이미 차 있습니다.
                <strong> 90분을 훌쩍 넘긴다면</strong> 대회 1~2일 전 탄수화물 비중을 올리는 정도가 현실적입니다.
              </p>
              <p className="text-gray-500">
                풀코스용 로딩(체중 1kg당 8~12g/일)을 하프에 그대로 적용하면 몸만 무겁습니다.
              </p>
            </Item>

            <Item weight="must" basis="practice" title="새로운 음식·젤·보충제를 대회 주간에 처음 쓰지 마세요">
              <p>
                이건 논문보다 사고 사례가 말해줍니다. <strong>대회 당일 처음 먹는 것은 전부 도박</strong>입니다.
                젤 브랜드, 스포츠음료, 카페인 양까지 <strong>연습 롱런에서 똑같이</strong> 해보세요.
              </p>
              <p className="text-gray-500">
                현장에서 나눠주는 낯선 보급품이나 옆 사람이 건네는 젤도 마찬가지입니다.
                받아먹고 배탈 나면 남은 10km가 지옥입니다.
              </p>
            </Item>
          </div>
        </section>

        {/* ── 전날 밤 · 당일 아침 ── */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">전날 밤 · 당일 아침 — 피해야 할 것</h2>
          <div className="space-y-3">
            <Item weight="must" basis="paper" title="섬유질·지방·단백질을 줄이세요">
              <p>
                달리는 중 배탈은 지구성 종목 참가자의 <strong>30~50%</strong>가 겪습니다.
                <strong>섬유질, 지방, 단백질, 그리고 농도가 진한 당 용액</strong>이 위험을 높이는 것으로 보고됩니다.
              </p>
              <p>
                실전으로 옮기면 — 대회 전날 저녁의 <strong>현미·잡곡·나물·샐러드·튀김·삼겹살</strong>,
                당일 아침의 <strong>우유·요거트·계란·견과류</strong>가 흔한 지뢰입니다.
                흰쌀밥, 흰빵, 바나나처럼 <strong>단순하고 소화 빠른 탄수화물</strong>이 무난합니다.
              </p>
            </Item>

            <Item weight="should" basis="experience" title="아침 식사는 출발 3시간 전, 그 뒤엔 액체로만">
              <p>
                제가 쓰는 방식입니다. 출발 3시간 전에 밥·빵으로 제대로 먹고,
                그 뒤로는 스포츠음료나 젤 같은 <strong>액체·반액체만</strong> 넣습니다.
                1시간 전에 고형식을 먹었을 때 5km 지점부터 옆구리가 결렸던 적이 있습니다.
              </p>
              <p className="text-gray-500">
                다만 이건 표본 1입니다. 사람마다 소화 속도가 달라서
                <strong> 연습 롱런에서 본인 간격을 찾는 게 맞습니다.</strong>
              </p>
            </Item>

            <Item weight="optional" basis="paper" title="카페인은 쓴다면 출발 60분 전, 체중 1kg당 3~6mg">
              <p>
                지구성 운동에서 카페인은 효과가 비교적 일관되게 보고되는 몇 안 되는 보조제입니다.
                권장 범위는 <strong>체중 1kg당 3~6mg</strong>이고, 60kg이면 180~360mg입니다.
                <strong>9mg/kg 같은 고용량은 부작용만 늘고 추가 이득이 없습니다.</strong>
              </p>
              <p className="text-gray-500">
                평소 커피를 안 마신다면 대회 당일에 처음 시도하지 마세요 — 손 떨림과 속쓰림이 옵니다.
              </p>
            </Item>
          </div>
        </section>

        {/* ── 레이스 중 ── */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">레이스 중 — 젤과 급수</h2>
          <div className="space-y-3">
            <Item weight="should" basis="paper" title="90분을 넘긴다면 시간당 탄수화물 30~60g">
              <p>
                지구성 경기 중 권장되는 섭취량은 <strong>시간당 30~60g</strong>입니다.
                에너지젤 하나가 보통 20~30g이니 <strong>시간당 1~2개</strong> 꼴입니다.
              </p>
              <p>
                2시간 이상 걸리는 러너라면 <strong>포도당+과당을 섞은 제품</strong>으로 시간당 60g 이상까지
                올릴 수 있다는 보고가 있지만, 위장이 견디는지는 사람마다 다릅니다.
                <strong>연습에서 검증되지 않은 증량은 배탈로 끝납니다.</strong>
              </p>
              <p className="text-gray-500">
                90분 안에 끝나는 러너는 젤이 없어도 됩니다. 저장 글리코겐으로 충분합니다.
              </p>
            </Item>

            <Item weight="should" basis="experience" title="젤은 급수대 직전에 까고, 물과 함께 넘기기">
              <p>
                젤만 삼키면 농도가 진해서 속이 울렁거립니다.
                <strong>급수대 100m쯤 앞에서 미리 까두고, 급수대에서 물과 같이 넘기는</strong> 순서가 편했습니다.
                젤을 스포츠음료로 넘기면 당이 겹쳐서 저는 피합니다.
              </p>
              <p className="text-gray-500">
                레이스 벨트에 넣어둔 젤을 꺼내느라 페이스가 흔들리는 것도 무시 못 합니다.
                <strong>손이 바로 가는 자리</strong>에 넣고, 개수는 미리 세어두세요.
              </p>
            </Item>

            <Item weight="must" basis="practice" title="종이컵은 한 번에 들이키지 말고 2~3모금씩">
              <p>
                종이컵을 통째로 들이키면 위가 출렁거려서 그때부터 불편합니다.
                <strong>2~3모금씩 나눠 마시는 것</strong>은 국내 러너들 사이에 널리 퍼진 요령입니다.
                위장 부담을 줄인다는 점에서 국제 권고와 어긋나지도 않습니다.
              </p>
              <p className="text-gray-500">
                이 항목은 처음에 &lsquo;논문 근거&rsquo;로 달아뒀다가 &lsquo;통용 관행&rsquo;으로 내렸습니다 —
                <strong>2~3모금이라는 숫자를 뒷받침하는 논문을 확인하지 못했습니다.</strong>
              </p>
              <p>
                <strong>다만 갈증이 없으면 그냥 지나가도 됩니다.</strong> 위의 저나트륨혈증 내용과 같습니다 —
                급수대 개수를 채워야 하는 게 아닙니다.
              </p>
            </Item>
          </div>
        </section>

        {/* ── 날씨·복장·마찰 ── */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">복장 · 마찰 · 날씨</h2>
          <div className="space-y-3">
            <Item weight="should" basis="practice" title="바세린은 겨드랑이·가슴·사타구니·발가락 사이">
              <p>
                피부가 옷이나 다른 피부에 반복해서 쓸리면 까집니다. 하프 거리에서도
                <strong>겨드랑이, 유두, 사타구니, 발가락 사이</strong>가 흔한 자리입니다.
                바세린이나 바디 글라이드 같은 마찰 방지 제품을 <strong>출발 직전에</strong> 바릅니다.
              </p>
              <p>
                러너들이 공통으로 강조하는 요령이 하나 있습니다 —
                <strong>바르기 전에 그 부위를 닦고 말리세요.</strong> 땀이나 물기가 남은 채로 바르면 겉돕니다.
              </p>
              <p className="text-gray-500">
                널리 쓰이는 방법이지만 <strong>바르는 위치나 효과를 검증한 논문은 확인하지 못했습니다.</strong>
                허벅지만 바르고 겨드랑이를 빼먹었다가 고생했다는 이야기가 커뮤니티에 자주 올라옵니다.
              </p>
            </Item>

            <Item weight="must" basis="experience" title="새 옷·새 신발로 대회에 나가지 마세요">
              <p>
                대회 기념 티셔츠를 그날 처음 입고 뛰었다가 <strong>봉제선에 겨드랑이가 까진 적</strong>이 있습니다.
                신발은 더 심각합니다 — 길들이지 않은 러닝화는 물집과 발톱 멍으로 직행합니다.
              </p>
              <p>
                양말도 마찬가지입니다. <strong>면 양말은 젖으면 마찰이 확 커져서</strong> 물집이 잘 잡힙니다.
                러닝용 기능성 양말로, 그것도 새것 말고 <strong>이미 신어본 것</strong>으로 가세요.
              </p>
              <p className="text-gray-500">
                최소 두세 번의 롱런을 같이 뛴 옷·신발·양말로 나가는 게 원칙입니다.
                대회 당일은 새 장비를 시험하는 날이 아닙니다.
              </p>
            </Item>

            <Item weight="should" basis="experience" title="더울 때 물 뿌리기 — 신발과 양말에는 닿지 않게">
              <p>
                더운 날 머리와 목덜미에 물을 끼얹으면 확실히 살 만해집니다. 다만
                <strong>물이 양말과 신발로 들어가면 그때부터 물집 시계가 돌아갑니다.</strong>
                젖은 양말과 피부의 마찰은 마른 상태와 비교가 안 됩니다.
              </p>
              <p>
                그래서 저는 <strong>컵을 얼굴 위쪽에서 뒤로 넘기듯</strong> 붓고, 몸통 앞쪽으로는 흘리지 않습니다.
                가슴으로 흘리면 결국 반바지와 신발까지 젖습니다.
              </p>
              <p className="text-gray-500">
                냉각 자체는 더운 환경에서 도움이 된다고 알려져 있지만,
                <strong>제가 쓰는 이 붓는 방식이 낫다는 비교 연구는 확인하지 못했습니다.</strong>
              </p>
            </Item>

            <Item weight="should" basis="practice" title="추운 날 출발 전 체온 — 버릴 옷 한 겹">
              <p>
                <strong>출발선에서 대기하는 20~30분이 제일 춥습니다.</strong> 이때 체온을 뺏기면
                초반에 근육이 굳어서 오히려 오버페이스가 나옵니다.
                안 입는 헌 옷이나 비닐 우의를 걸치고 출발 직전에 벗는 게 흔한 방법이라
                &lsquo;버리는 옷&rsquo;이라고 부릅니다.
              </p>
              <p className="text-gray-500">
                대회에서 수거해 기부하는 경우가 많습니다. 아무 데나 던지지 말고 수거함에 넣으세요.
              </p>
            </Item>
          </div>
        </section>

        {/* ── 현장 ── */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">대회장 도착 후 — 사소한데 크게 망하는 것들</h2>
          <div className="space-y-3">
            <Item weight="must" basis="practice" title="배번표와 기록칩은 전날 밤에 달아두세요">
              <p>
                당일 아침에 안전핀을 찾는 순간부터 리듬이 깨집니다.
                <strong>배번표는 전날 상의에 달아두고, 기록칩은 신발 끈에 미리 끼워두세요.</strong>
                안전핀은 현장에서 모자라는 경우가 있으니 여분을 챙기는 게 안전합니다.
              </p>
            </Item>

            <Item weight="should" basis="practice" title="1시간~1시간 30분 전 도착, 도착하면 화장실부터">
              <p>
                워밍업보다 <strong>화장실·물품보관소·출발선 위치 파악이 먼저</strong>입니다.
                <strong>출발 30분 전이 화장실 줄이 가장 깁니다.</strong> 그 전에 한 번 다녀오세요.
              </p>
              <p className="text-gray-500">
                물품보관 가방은 맡기기 전에 <strong>번호표와 가방을 사진으로</strong> 찍어두면
                나중에 찾을 때 편합니다. 비슷한 가방이 정말 많습니다.
              </p>
            </Item>

            <Item weight="should" basis="practice" title="출발 위치는 자기 기록대로">
              <p>
                욕심내서 앞쪽에 서면 빠른 러너들에게 떠밀려 <strong>첫 1km부터 오버페이스</strong>가 납니다.
                반대로 너무 뒤에 서면 사람에 막혀 답답하고요.
                대회에서 그룹 구역을 나눠놨다면 그대로 따르는 게 맞습니다.
              </p>
            </Item>
          </div>
        </section>

        {/* ── 페이스 ── */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">페이스 — 가장 많이 망하는 지점</h2>
          <div className="space-y-3">
            <Item weight="must" basis="experience" title="첫 5km는 &lsquo;조금 느린데?&rsquo; 싶을 정도로">
              <p>
                출발 신호가 떨어지면 주변 분위기에 그냥 끌려갑니다.
                저는 첫 대회에서 목표보다 <strong>1km당 20초 빠르게</strong> 5km를 지났고,
                15km부터 <strong>다리가 안 올라갔습니다.</strong>
                초반에 번 30초는 후반에 3분으로 돌아옵니다.
              </p>
              <p className="text-gray-500">
                오버페이스는 감으로 못 잡습니다. <strong>워치를 보고 의식적으로 눌러야</strong> 합니다.
                &ldquo;이 정도면 너무 느린가&rdquo; 싶은 게 대체로 맞는 페이스입니다.
              </p>
            </Item>

            <Item weight="should" basis="experience" title="15~18km에서 무너지는 건 정상입니다">
              <p>
                하프에서 가장 힘든 구간은 마지막이 아니라 <strong>15~18km</strong>입니다.
                다리가 무거워지고 페이스가 퍼지기 시작하는데,
                <strong>여기서 &ldquo;내가 뭘 잘못했나&rdquo; 싶어 패닉하면 그대로 걷기로 넘어갑니다.</strong>
              </p>
              <p>
                이 구간이 온다는 걸 미리 알고 있는 것만으로도 다릅니다.
                저는 <strong>남은 거리를 3km 단위로 쪼개서</strong> 넘겼습니다 —
                &ldquo;18km까지만&rdquo;, 그다음 &ldquo;골인까지만&rdquo;.
              </p>
              <p className="text-gray-500">
                그리고 하프는 20km가 아니라 <strong>21.0975km</strong>입니다.
                20km를 지나고도 1km가 더 남아 있고, 그 1km가 유난히 깁니다.
              </p>
            </Item>

            <Item weight="must" basis="practice" title="컷오프(제한시간)를 미리 확인하세요">
              <p>
                대부분의 하프 대회에는 <strong>제한시간과 중간 통제 지점</strong>이 있습니다.
                거기서 통과하지 못하면 회수 차량을 타야 합니다.
                <strong>첫 하프라면 자기 예상 완주 시간이 컷오프 안에 들어오는지</strong>를
                접수 전에 확인해두세요.
              </p>
              <p className="text-gray-500">
                대회마다 다르니 참가 안내문의 숫자를 보세요. 이 페이지에 일반값을 적지 않는 이유입니다.
              </p>
            </Item>

            <Item weight="optional" basis="practice" title="페이스메이커 활용">
              <p>
                목표 기록 풍선을 단 페이스메이커를 따라가면 페이스 관리가 훨씬 쉽습니다.
                워치를 계속 안 봐도 되고요. 다만 페메 그룹은 사람이 몰려서 급수대에서 엉킵니다.
                <strong>급수 때는 그룹에서 살짝 빠져 가장자리로 붙었다가 다시 합류하는</strong> 편이 안전합니다.
              </p>
              <p className="text-gray-500">
                급수대에서 갑자기 멈추면 뒤에서 오는 사람과 부딪힙니다. 속도를 줄이면서 옆으로 빠지세요.
              </p>
            </Item>
          </div>
        </section>

        {/* ── 참고 자료 ── */}
        <section className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-3">참고 자료</h2>
          <p className="text-sm text-gray-500 mb-3 leading-relaxed">
            위에서 <strong>&lsquo;논문 근거&rsquo;</strong>로 표시한 항목의 출처입니다.
            &lsquo;통용 관행&rsquo;과 &lsquo;직접 경험&rsquo; 항목에는 대응하는 논문이 없습니다.
          </p>
          <ul className="space-y-2 text-sm">
            <li className="flex gap-2"><span className="text-gray-400">•</span>
              <a href="https://pubmed.ncbi.nlm.nih.gov/26891166/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">
                Thomas et al. (2016) Med Sci Sports Exerc 48(3):543-68 — ACSM·미국영양학회·캐나다영양사협회 합동 성명, 스포츠 영양 종합 권고 ↗
              </a>
            </li>
            <li className="flex gap-2"><span className="text-gray-400">•</span>
              <a href="https://pubmed.ncbi.nlm.nih.gov/26102445/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">
                Hew-Butler et al. (2015) Clin J Sport Med 25(4):303-20 — 제3차 운동유발 저나트륨혈증 국제 합의문 ↗
              </a>
            </li>
            <li className="flex gap-2"><span className="text-gray-400">•</span>
              <a href="https://pubmed.ncbi.nlm.nih.gov/24791919/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">
                de Oliveira et al. (2014) Sports Med 44(Suppl 1):79-85 — 운동 중 위장 증상의 빈도·원인·영양 권고 ↗
              </a>
            </li>
            <li className="flex gap-2"><span className="text-gray-400">•</span>
              <a href="https://pubmed.ncbi.nlm.nih.gov/33388079/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">
                Guest et al. (2021) J Int Soc Sports Nutr — 국제스포츠영양학회 카페인 포지션 스탠드 ↗
              </a>
            </li>
          </ul>
          <p className="mt-3 text-xs text-gray-400">추천 순서는 광고비로 바뀌지 않습니다. 공개된 연구 자료를 근거로 작성했습니다.</p>
        </section>

        <YoutubeSection links={[
          // 2026-08-31 신설. 검색 URL은 임시다 — 실제 영상으로 교체하고
          // npm run check:youtube 로 채널을 확인할 것. channel은 확인 전까지 비워둔다.
          { label: "하프마라톤 대회 준비 영상 검색", url: "https://www.youtube.com/results?search_query=하프마라톤+대회+준비+초보" },
          { label: "에너지젤 먹는 법 영상 검색", url: "https://www.youtube.com/results?search_query=마라톤+에너지젤+먹는법" },
        ]} />

        <FaqSection items={[
          {
            q: "하프마라톤도 탄수화물 로딩을 해야 하나요?",
            a: "완주에 90분 이내가 걸린다면 대체로 필요 없습니다. 몸에 저장된 글리코겐이 중강도 달리기 75~90분 분량이라 평소 식사로 이미 채워져 있습니다. 90분을 넘긴다면 대회 1~2일 전 탄수화물 비중을 올리는 정도가 현실적이고, 풀코스용 고용량 로딩을 그대로 적용하면 몸만 무거워집니다.",
          },
          {
            q: "하프마라톤에서 에너지젤은 몇 개 먹어야 하나요?",
            a: "90분 이내로 들어온다면 없어도 됩니다. 그 이상 걸린다면 시간당 탄수화물 30~60g이 권장 범위이고, 젤 하나가 보통 20~30g이라 시간당 1~2개 꼴입니다. 중요한 건 개수보다 연습 롱런에서 같은 제품으로 미리 시험해보는 것입니다 — 대회 당일 처음 먹는 젤은 배탈 위험이 큽니다.",
          },
          {
            q: "대회 중에 물은 얼마나 마셔야 하나요?",
            a: "목마른 만큼만 마시는 것이 현재 국제 합의 권고입니다. 급수대마다 무조건 마실 필요는 없습니다. 물을 과하게 마시면 혈중 나트륨이 희석되는 운동유발 저나트륨혈증 위험이 있고, 탈수보다 이쪽이 더 자주 문제가 됩니다. 달리는 중 체중이 늘었거나 메스꺼움·두통·손발 부기가 있으면 즉시 의료진에게 가세요.",
          },
          {
            q: "대회 전날 저녁과 당일 아침에 피해야 할 음식은 뭔가요?",
            a: "섬유질, 지방, 단백질, 농도가 진한 당 용액이 운동 중 위장 증상 위험을 높이는 것으로 보고됩니다. 전날 저녁의 현미·잡곡·나물·튀김·삼겹살, 당일 아침의 우유·요거트·계란·견과류가 흔한 지뢰입니다. 흰쌀밥·흰빵·바나나처럼 단순하고 소화가 빠른 탄수화물이 무난합니다.",
          },
        ]} />

        <p className="text-xs text-gray-400 mb-4">
          ※ 이 콘텐츠는 일반적인 정보 제공 목적이며 의학적 진단이나 치료를 대체하지 않습니다.
          지병이 있거나 약을 복용 중이라면 대회 참가 전 전문의와 상담하세요.
        </p>

        <div className="mt-10 p-6 bg-emerald-50 rounded-2xl">
          <p className="font-medium text-emerald-900 mb-2">대회용 신발은 정하셨나요?</p>
          <p className="text-sm text-emerald-800 mb-4">
            길들이지 않은 신발로 대회에 나가는 것이 물집의 가장 흔한 원인입니다.
            체형과 발 조건을 넣으면 맞는 신발을 추려드립니다.
          </p>
          <Link href="/shoe-finder" className="inline-block bg-emerald-600 text-white text-sm font-medium px-6 py-3 rounded-xl hover:bg-emerald-700 transition-colors">
            내 러닝화 찾기 →
          </Link>
        </div>
      </article>
    </>
  );
}
