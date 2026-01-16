# XML 예시 (상세서.md 구조 1:1 매핑)

아래 XML은 `상세서.md`의 섹션/규칙/값을 **누락 없이** 구조화한 예시입니다.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<UiUxSpec lang="ko-KR">
  <Document>
    <Title>의료 AI 서비스 MVP UI/UX 상세서 (Web · Mobile Responsive)</Title>
    <Meta>
      <Version>v0.1</Version>
      <Stage>MVP</Stage>
      <Date>2026-01-16</Date>
      <Audience>
        <Item>기획</Item>
        <Item>디자인</Item>
        <Item>프론트엔드</Item>
        <Item>백엔드</Item>
      </Audience>
    </Meta>
  </Document>

  <Section number="0" id="assumptions" title="전제/가정(변경 가능)">
    <Assumptions>
      <Item>
        <Label>서비스 형태</Label>
        <Value>의료 데이터(문진/검사결과 등)를 입력하면 상용 AI 모듈/API가 분석 결과를 제공하는 B2B/B2B2C형 MVP(웹 기반, 모바일 대응).</Value>
      </Item>
      <Item>
        <Label>사용자 역할</Label>
        <Value>의료진(또는 상담사) / 관리자(Admin) 중심. (환자 직접 사용은 2차 범위로 두되, 화면 구조는 확장 가능하게 설계)</Value>
      </Item>
      <Item>
        <Label>핵심 기능(최소)</Label>
        <Value>케이스 생성 → 데이터 입력/업로드 → AI 분석 요청/진행상태 → 결과 조회/공유(PDF) → 케이스 관리.</Value>
      </Item>
      <Item>
        <Label>금지/주의</Label>
        <Value>UI 문구는 “진단/처방”이 아니라 “참고/보조” 표현을 기본으로 하며, 결과 화면에 의료 책임 고지를 고정 노출.</Value>
      </Item>
    </Assumptions>
  </Section>

  <Section number="1" id="ux-goals" title="UX 목표(원칙)">
    <Goals>
      <Goal order="1" keyword="신뢰">의료 서비스 톤(차분함/정확함), 근거/버전/시간을 명확히 노출</Goal>
      <Goal order="2" keyword="안전">위험도(High/Medium/Low) 강조 + “응급” 시 행동 유도(연락/내원) UI 제공</Goal>
      <Goal order="3" keyword="최소 입력">MVP는 “필수 최소 항목”만 요구, 나머지는 선택 입력으로 단계화</Goal>
      <Goal order="4" keyword="투명성">AI 생성임을 명확히 표시하고, “확신도/한계/주의사항” 섹션을 표준화</Goal>
      <Goal order="5" keyword="협업">케이스 단위로 메모/상태/담당자/공유 내역이 남는 구조</Goal>
    </Goals>
  </Section>

  <Section number="2" id="information-architecture" title="정보 구조(IA) &amp; 내비게이션">
    <SubSection number="2.1" id="menu-structure" title="메뉴 구조(권장)">
      <Menu>
        <MenuItem id="dashboard" title="대시보드" optional="false">
          <Children>
            <Item>케이스 목록(검색/필터/정렬)</Item>
            <Item>내 작업(담당 케이스)</Item>
          </Children>
        </MenuItem>
        <MenuItem id="new-case" title="새 케이스" optional="false">
          <Children>
            <Item>문진/자료 업로드</Item>
            <Item>AI 분석 요청</Item>
          </Children>
        </MenuItem>
        <MenuItem id="reports" title="리포트" optional="true" note="옵션">
          <Children>
            <Item>사용량/성능 지표(관리자)</Item>
          </Children>
        </MenuItem>
        <MenuItem id="settings" title="설정" optional="false" audience="관리자">
          <Children>
            <Item>사용자/권한</Item>
            <Item>AI 연동 설정(API Key, 엔드포인트, 모델 버전)</Item>
            <Item>감사로그/접근기록</Item>
          </Children>
        </MenuItem>
      </Menu>
    </SubSection>

    <SubSection number="2.2" id="navigation-patterns" title="내비게이션 패턴">
      <NavigationPatterns>
        <Pattern device="Desktop" breakpoint="≥1024px">좌측 사이드바(고정) + 상단 헤더(고정)</Pattern>
        <Pattern device="Tablet" breakpoint="768–1023px">사이드바 축소(아이콘) 또는 햄버거 드로어</Pattern>
        <Pattern device="Mobile" breakpoint="&lt;768px">상단 헤더 + 하단 탭바(최대 4개) / 설정은 더보기 또는 드로어</Pattern>
      </NavigationPatterns>
    </SubSection>
  </Section>

  <Section number="3" id="design-system" title="디자인 시스템(토큰) — 구현 기준">
    <Note>아래 토큰은 CSS 변수/디자인 토큰으로 그대로 옮겨 구현 가능하도록 값을 고정합니다.</Note>

    <SubSection number="3.1" id="colors" title="컬러 팔레트">
      <Palette name="Neutral" title="기본(Neutral)">
        <Token role="배경" name="--color-bg" value="#F8FAFC" />
        <Token role="표면(카드/모달)" name="--color-surface" value="#FFFFFF" />
        <Token role="보조 표면" name="--color-surface-2" value="#F1F5F9" />
        <Token role="보더" name="--color-border" value="#E2E8F0" />
        <Token role="강한 보더" name="--color-border-strong" value="#CBD5E1" />
        <Token role="본문 텍스트" name="--color-text" value="#0F172A" />
        <Token role="보조 텍스트" name="--color-text-muted" value="#475569" />
        <Token role="힌트/플레이스홀더" name="--color-text-subtle" value="#64748B" />
      </Palette>

      <Palette name="Brand" title="브랜드/액션">
        <Token role="Primary" name="--color-primary" value="#2563EB" />
        <Token role="Primary Hover" name="--color-primary-hover" value="#1D4ED8" />
        <Token role="Primary Active" name="--color-primary-active" value="#1E40AF" />
        <Token role="On Primary" name="--color-on-primary" value="#FFFFFF" />
        <Token role="Secondary(강조/토글)" name="--color-secondary" value="#14B8A6" />
        <Token role="Secondary Hover" name="--color-secondary-hover" value="#0D9488" />
        <Token role="Secondary Active" name="--color-secondary-active" value="#0F766E" />
        <Token role="Focus Ring" name="--color-focus" value="#93C5FD" />
      </Palette>

      <Palette name="Semantic" title="상태(Semantic)">
        <Token role="Success" name="--color-success" value="#16A34A" />
        <Token role="Warning" name="--color-warning" value="#F59E0B" />
        <Token role="Danger" name="--color-danger" value="#DC2626" />
        <Token role="Info" name="--color-info" value="#0EA5E9" />
        <Token role="Overlay(모달)" name="--color-overlay" value="rgba(15, 23, 42, 0.55)" />
      </Palette>

      <RiskBadgeStandard title="위험도(Risk Badge 표준)">
        <RiskLevel name="Low" background="#DCFCE7" text="#166534" />
        <RiskLevel name="Medium" background="#FEF3C7" text="#92400E" />
        <RiskLevel name="High" background="#FEE2E2" text="#991B1B" />
      </RiskBadgeStandard>

      <Rules>
        <Rule>Primary는 “주요 CTA(저장/분석요청/공유)”에만 사용(동일 화면 1개 권장).</Rule>
        <Rule>Danger는 “삭제/민감 조작/오류”에만 사용(정보성 경고는 Warning/Info).</Rule>
        <Rule>결과 화면에서 Risk 색상은 배지/요약영역에만 제한적으로 사용(페이지 전체를 붉게 만들지 않음).</Rule>
      </Rules>
    </SubSection>

    <SubSection number="3.2" id="typography" title="타이포그래피">
      <Fonts>
        <Base> Pretendard </Base>
        <Fallbacks>
          <Item>Noto Sans KR</Item>
          <Item>Inter</Item>
        </Fallbacks>
        <FontStack>Pretendard, "Noto Sans KR", Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Apple SD Gothic Neo", "Malgun Gothic", "맑은 고딕", sans-serif</FontStack>
      </Fonts>

      <TextStyles>
        <TextStyle name="Display" usage="화면 타이틀" fontSizePx="24" lineHeightPx="32" fontWeight="600" />
        <TextStyle name="H1" usage="섹션 타이틀" fontSizePx="20" lineHeightPx="28" fontWeight="600" />
        <TextStyle name="H2" usage="카드/블록 타이틀" fontSizePx="18" lineHeightPx="26" fontWeight="600" />
        <TextStyle name="H3" usage="리스트 타이틀" fontSizePx="16" lineHeightPx="24" fontWeight="600" />
        <TextStyle name="Body" usage="기본 본문" fontSizePx="14" lineHeightPx="22" fontWeight="400" />
        <TextStyle name="Body-M" usage="강조 본문" fontSizePx="14" lineHeightPx="22" fontWeight="500" />
        <TextStyle name="Caption" usage="도움말/라벨" fontSizePx="12" lineHeightPx="18" fontWeight="400" />
      </TextStyles>

      <Rules>
        <Rule>본문은 기본 14px로 고정(정보 밀도가 높은 의료 업무 화면에 적합). 모바일은 14px 유지하되 행간 22px 유지.</Rule>
        <Rule>표/리스트는 Body(14px)를 기본으로, 컬럼 헤더만 Body-M(500) 사용.</Rule>
      </Rules>
    </SubSection>

    <SubSection number="3.3" id="spacing" title="스페이싱(8pt 기반 + 4pt 보조)">
      <SpacingScale basePx="8" supportPx="4">
        <Space name="--space-1" px="4" usage="아이콘-텍스트 간격" />
        <Space name="--space-2" px="8" usage="라벨-입력 간격" />
        <Space name="--space-3" px="12" usage="카드 내부 요소 간격" />
        <Space name="--space-4" px="16" usage="카드 패딩(기본)" />
        <Space name="--space-6" px="24" usage="섹션 간격" />
        <Space name="--space-8" px="32" usage="페이지 주요 블록 간격" />
        <Space name="--space-12" px="48" usage="큰 여백(온보딩/빈화면)" />
      </SpacingScale>
    </SubSection>

    <SubSection number="3.4" id="radius-shadow" title="라운드/섀도우">
      <Radii>
        <Radius usage="입력창/버튼 라운드" px="10" />
        <Radius usage="카드 라운드" px="12" />
        <Radius usage="모달 라운드" px="16" />
        <Radius usage="Pill(배지/태그)" px="9999" />
      </Radii>
      <Shadows>
        <Shadow name="--shadow-sm" value="0 1px 2px rgba(15,23,42,0.08)" />
        <Shadow name="--shadow-md" value="0 4px 14px rgba(15,23,42,0.10)" />
        <Shadow name="--shadow-lg" value="0 10px 30px rgba(15,23,42,0.14)" />
      </Shadows>
    </SubSection>

    <SubSection number="3.5" id="interaction" title="인터랙션/터치 규칙">
      <InteractionRules>
        <Rule>최소 클릭/터치 영역: 44×44px</Rule>
        <Rule>포커스 링: 2px --color-focus (outline) + 기존 보더 유지</Rule>
        <Rule>모든 인터랙션(버튼/링크/아이콘버튼)은 hover, active, disabled, loading 상태를 가져야 함</Rule>
      </InteractionRules>
    </SubSection>
  </Section>

  <Section number="4" id="layout" title="레이아웃/그리드/반응형">
    <SubSection number="4.1" id="breakpoints" title="브레이크포인트(권장)">
      <Breakpoints>
        <Breakpoint name="Mobile" width="&lt;768px" />
        <Breakpoint name="Tablet" width="768–1023px" />
        <Breakpoint name="Desktop" width="≥1024px" />
        <Breakpoint name="Wide" width="≥1440px" />
      </Breakpoints>
    </SubSection>

    <SubSection number="4.2" id="global-layout" title="공통 레이아웃 규격">
      <GlobalLayout>
        <Header heightPx="56">
          <Left>로고 + 페이지명</Left>
          <Right>사용자 메뉴(프로필/로그아웃)</Right>
        </Header>
        <Sidebar desktopWidthPx="240" collapsedWidthPx="72" />
        <ContentContainer maxWidthPx="1200">
          <Padding desktopPx="24" mobilePx="16" />
          <TopSpacingUnderHeader px="24" />
        </ContentContainer>
      </GlobalLayout>
    </SubSection>

    <SubSection number="4.3" id="page-template" title="페이지 구성 규칙(템플릿)">
      <TemplateRules>
        <Rule order="1" title="Page Header">
          <Left>Display 타이틀 + Caption 서브텍스트(선택)</Left>
          <Right>주요 CTA 1개(Primary), 보조 CTA(Outline/Secondary)</Right>
        </Rule>
        <Rule order="2" title="Filter/Action Bar(리스트 화면)">
          <Left>검색창, 필터(상태/기간/위험도)</Left>
          <Right>정렬, 내보내기(옵션)</Right>
        </Rule>
        <Rule order="3" title="Content">카드/테이블 기반</Rule>
        <Rule order="4" title="Empty/Loading/Error">표준 컴포넌트로 대체(6.2/6.1/6.3)</Rule>
      </TemplateRules>
    </SubSection>
  </Section>

  <Section number="5" id="components" title="컴포넌트 규격(디자인/개발 공통)">
    <GeneralRule>모든 컴포넌트는 “사이즈(Height/Pad) + 상태 + 접근성”을 포함해 구현합니다.</GeneralRule>

    <Component number="5.1" id="button" title="버튼(Button)">
      <Sizes>
        <Size name="sm" heightPx="32" paddingXpx="12" fontSizePx="14" fontWeight="500" />
        <Size name="md" heightPx="40" paddingXpx="16" fontSizePx="14" fontWeight="600" default="true" />
        <Size name="lg" heightPx="48" paddingXpx="20" fontSizePx="14" fontWeight="600" />
      </Sizes>
      <Variants>
        <Variant name="primary" background="--color-primary" text="--color-on-primary" />
        <Variant name="secondary" background="--color-secondary" text="#FFFFFF" />
        <Variant name="outline" background="transparent" border="1px --color-border-strong" text="--color-text" />
        <Variant name="ghost" background="transparent" text="--color-text" note="툴바/아이콘 근처" />
        <Variant name="danger" background="--color-danger" text="#FFFFFF" note="삭제/폐기" />
      </Variants>
      <States>
        <State name="hover">배경/보더 명도 -1 단계(토큰 hover 사용)</State>
        <State name="disabled">bg --color-border, text --color-text-subtle, cursor not-allowed</State>
        <State name="loading">버튼 높이 유지 + 스피너(16px) + 텍스트 유지 또는 “처리 중…”</State>
      </States>
    </Component>

    <Component number="5.2" id="icon-button" title="아이콘 버튼(Icon Button)">
      <Spec>
        <Item>크기: 40×40px(기본), 아이콘 20px</Item>
        <Item>배경: 기본 transparent, hover 시 --color-surface-2</Item>
        <Item>툴팁(Desktop): 600ms hover 시 표시</Item>
      </Spec>
    </Component>

    <Component number="5.3" id="input" title="입력창(Input)">
      <Base>
        <Item>높이: 40px(기본), 큰 입력 48px(온보딩/모바일 권장)</Item>
        <Item>패딩: 좌우 12px, 텍스트 상하 중앙 정렬</Item>
        <Item>보더: 1px --color-border</Item>
        <Item>라운드: 10px</Item>
        <Item>플레이스홀더: --color-text-subtle</Item>
      </Base>
      <ValidationStates>
        <State name="focus">보더 --color-primary + 외곽 2px --color-focus</State>
        <State name="error">보더 --color-danger, 하단 helper 텍스트(12px, --color-danger)</State>
        <State name="success" optional="true">보더 --color-success(주로 폼 제출 후)</State>
      </ValidationStates>
      <LabelAndHelpRules>
        <Rule>라벨: 입력 위, Caption(12px) / 필수는 * 표기</Rule>
        <Rule>도움말: 라벨 아래 또는 입력 아래(일관성 유지), 최대 2줄</Rule>
        <Rule>오류 문구는 “무엇이/왜/어떻게”를 포함: 예) “생년월일 형식이 올바르지 않습니다(YYYY-MM-DD).”</Rule>
      </LabelAndHelpRules>
    </Component>

    <Component number="5.4" id="textarea" title="텍스트 영역(Textarea)">
      <Spec>
        <Item>최소 높이 96px, resize는 기본 off(레이아웃 안정), 필요 시 “확장” 버튼 제공</Item>
        <Item>글자 수 카운터(옵션): 우하단 12px, 0/500 형태</Item>
      </Spec>
    </Component>

    <Component number="5.5" id="select-dropdown" title="셀렉트/드롭다운(Select/Dropdown)">
      <Spec>
        <Item>트리거: Input과 동일 규격(높이/보더/라운드)</Item>
        <Item>드롭다운: 최대 높이 280px, 스크롤, 항목 높이 40px</Item>
        <Item>키보드: ↑↓ 이동, Enter 선택, Esc 닫기</Item>
      </Spec>
    </Component>

    <Component number="5.6" id="card" title="카드(Card)">
      <Spec>
        <Item>라운드 12px, 배경 --color-surface, 보더 1px --color-border, 그림자 --shadow-sm</Item>
        <Item>패딩: 16px(기본), 내부 요소 간격 12px</Item>
        <Item>카드 헤더(선택): 제목(H2/H3) + 우측 액션(아이콘 버튼)</Item>
        <Item>클릭형 카드(리스트): hover 시 --shadow-md + 보더 --color-border-strong</Item>
      </Spec>
    </Component>

    <Component number="5.7" id="modal" title="모달(Modal)">
      <Overlay>--color-overlay</Overlay>
      <Widths>
        <Width size="sm" px="360" usage="간단 확인" />
        <Width size="md" px="560" usage="폼/설정" />
        <Width size="lg" px="720" usage="미리보기/결과 공유" />
      </Widths>
      <Behavior>
        <Item>최대 높이: 80vh, body 스크롤</Item>
        <Item>헤더: 타이틀(H2) + 닫기(X)</Item>
        <Item>푸터: 우측 정렬 버튼 2개(취소 Outline, 확인 Primary)</Item>
        <Item>닫기 규칙: ESC 가능, 오버레이 클릭 닫기 여부는 케이스별(데이터 손실 위험 시 비활성)</Item>
      </Behavior>
    </Component>

    <Component number="5.8" id="toast-banner" title="토스트/배너(Toast/Banner)">
      <Toast>
        <Item>위치: 우하단(Desktop) / 상단(모바일) 스택</Item>
        <Item>5초 자동 종료(중요 오류 제외)</Item>
      </Toast>
      <Banner>
        <Item>페이지 상단 고정형</Item>
        <Item>네트워크 오류/권한/연동 실패 등 “상태 유지형” 메시지</Item>
      </Banner>
    </Component>

    <Component number="5.9" id="table-list" title="테이블/리스트(Table/List)">
      <Spec>
        <Item>헤더 높이 44px, 바디 행 높이 48px</Item>
        <Item>첫 컬럼은 “식별 정보(케이스ID/환자 요약)” 고정 권장</Item>
        <Item>모바일은 테이블을 카드 리스트로 변환(행당 2~3줄 요약)</Item>
        <Item>정렬: 컬럼 헤더 클릭(가능 시), 정렬 아이콘 표시</Item>
      </Spec>
    </Component>

    <Component number="5.10" id="badge-tag" title="배지/태그(Badge/Tag)">
      <Base heightPx="24" paddingXpx="8" fontSizePx="12" fontWeight="500" radius="pill" />
      <StatusBadgeExamples>
        <Example name="대기" tone="회색" />
        <Example name="분석중" tone="Info" />
        <Example name="완료" tone="Success" />
        <Example name="실패" tone="Danger" />
        <Example name="위험도" note="Low/Medium/High (3.1 표준 색상 사용)" />
      </StatusBadgeExamples>
    </Component>

    <Component number="5.11" id="stepper" title="스텝퍼(Stepper) — 케이스 생성 플로우">
      <Spec>
        <Item>단계: 4단계 권장(기본정보 → 문진 → 자료첨부 → 확인/요청)</Item>
        <Item>현재 단계 강조(Primary), 완료 단계 체크 아이콘</Item>
        <Item>모바일은 상단 진행바(%) + 단계명 1줄로 축약</Item>
      </Spec>
    </Component>

    <Component number="5.12" id="file-upload" title="파일 업로드(File Upload)">
      <DropZone width="100%" heightPx="120" borderStyle="dashed" borderColor="--color-border-strong" />
      <AllowedFiles>
        <Item>이미지(PNG/JPG)</Item>
        <Item>PDF(권장)</Item>
        <Item note="MVP 범위 밖">DICOM</Item>
      </AllowedFiles>
      <FileCard>
        <Item>파일명(한 줄)</Item>
        <Item>크기</Item>
        <Item>업로드 상태(진행바)</Item>
        <Item>삭제 아이콘</Item>
      </FileCard>
      <Errors>
        <Item>용량 초과</Item>
        <Item>형식 불가</Item>
        <Item>업로드 실패</Item>
        <Rule>오류는 파일 단위로 표시</Rule>
      </Errors>
    </Component>

    <Component number="5.13" id="ai-processing" title="AI 진행상태(Processing)">
      <StatusFlow>
        <Step order="1">요청 접수</Step>
        <Step order="2">데이터 전처리</Step>
        <Step order="3">AI 분석</Step>
        <Step order="4">결과 생성</Step>
        <Step order="5">완료</Step>
      </StatusFlow>
      <UIRules>
        <Rule>각 단계는 아이콘 + 텍스트로 노출, 진행 중 단계는 스피너(16px)</Rule>
        <Rule>“재시도”는 실패 시에만 노출</Rule>
        <Rule>“취소”는 분석 초기(1~2단계)에서만 노출(백엔드 정책과 동기화)</Rule>
      </UIRules>
    </Component>

    <Component number="5.14" id="risk-indicator" title="위험도/점수(Risk Indicator)">
      <DisplayRule>표기: High/Medium/Low + 점수(0–100) 옵션</DisplayRule>
      <RecommendedUI>
        <Item>배지(필수) + 작은 게이지 바(선택)</Item>
        <Item>High는 상단 요약영역에 “행동 유도 CTA”(예: “응급의심 시 즉시 의료기관 안내”)를 함께 표시</Item>
      </RecommendedUI>
    </Component>
  </Section>

  <Section number="6" id="standard-states" title="표준 상태 UI(로딩/빈 화면/오류)">
    <SubSection number="6.1" id="loading" title="로딩(Loading)">
      <Rules>
        <Rule>전체 페이지 로딩: 스켈레톤(카드/테이블 형태 유지)</Rule>
        <Rule>버튼 로딩: 버튼 내부 스피너 + 텍스트 유지(레이아웃 흔들림 방지)</Rule>
        <Rule>AI 분석 로딩: 5.13 진행상태 컴포넌트 사용(단순 스피너 금지)</Rule>
      </Rules>
    </SubSection>

    <SubSection number="6.2" id="empty-state" title="빈 화면(Empty State)">
      <Composition fixed="true">
        <Element order="1">아이콘(48px)</Element>
        <Element order="2">제목(H2) + 설명(Body)</Element>
        <Element order="3">Primary CTA 1개(예: “새 케이스 만들기”)</Element>
      </Composition>
    </SubSection>

    <SubSection number="6.3" id="error" title="오류(Error)">
      <Types>
        <Type name="입력 오류">필드 하단 inline error</Type>
        <Type name="API/연동 오류">페이지 상단 Banner + “재시도/문의” 액션</Type>
        <Type name="치명적 오류(권한/세션 만료)">모달로 안내 후 로그인 이동</Type>
      </Types>
    </SubSection>
  </Section>

  <Section number="7" id="screens" title="핵심 화면 명세(MVP)">
    <Screen number="7.1" id="login" title="로그인(Login)">
      <Purpose>사용자 인증 및 역할 기반 접근.</Purpose>
      <Layout>
        <Item>중앙 카드(폭 360px), 배경 --color-bg</Item>
      </Layout>
      <Components>
        <Item>로고/서비스명</Item>
        <Item>입력: 이메일(또는 ID), 비밀번호</Item>
        <Item>버튼: 로그인(Primary)</Item>
        <Item optional="true">보조: “비밀번호 재설정”(링크)</Item>
      </Components>
      <ValidationAndStates>
        <Item>실패: “아이디 또는 비밀번호가 올바르지 않습니다.”(Banner 또는 inline)</Item>
        <Item optional="true">5회 실패 시: Captcha/잠금(옵션, MVP는 미포함 가능)</Item>
      </ValidationAndStates>
    </Screen>

    <Screen number="7.2" id="consent" title="동의/주의 고지(Consent)">
      <Purpose>의료 AI 고지/데이터 처리 동의(감사 대응).</Purpose>
      <Components>
        <Checkbox required="true">“본 서비스는 의료진 판단을 보조하는 참고정보입니다.”</Checkbox>
        <Checkbox required="true">“데이터 처리 및 보관 정책에 동의합니다.”</Checkbox>
        <Link>개인정보처리방침/이용약관(모달 또는 새 탭)</Link>
        <Button variant="primary">동의하고 계속</Button>
      </Components>
      <Rules>
        <Rule>동의 완료 전에는 케이스 생성/분석 요청 CTA 비활성</Rule>
        <Rule>동의 기록: 동의일시/버전 표시(설정/프로필에서 재확인 가능)</Rule>
      </Rules>
    </Screen>

    <Screen number="7.3" id="case-list" title="대시보드/케이스 목록(Case List)">
      <Purpose>케이스 탐색/우선순위 처리.</Purpose>
      <Layout>
        <Item>상단 Page Header: “케이스”</Item>
        <Item>Filter Bar: 검색 + 필터 + 정렬</Item>
        <Item>본문: Table(Desktop) / Card List(Mobile)</Item>
      </Layout>
      <TableColumns recommended="true">
        <Column>케이스ID</Column>
        <Column>환자 요약(성별/연령대/주호소 1줄)</Column>
        <Column>상태(대기/분석중/완료/실패)</Column>
        <Column>위험도 배지</Column>
        <Column>생성일시 / 업데이트 일시</Column>
        <Column optional="true">담당자</Column>
        <Column>액션(보기)</Column>
      </TableColumns>
      <Filters recommended="true">
        <Filter>상태</Filter>
        <Filter>위험도</Filter>
        <Filter>기간(최근 7일/30일/직접)</Filter>
        <Filter optional="true">담당자</Filter>
      </Filters>
      <Interactions>
        <Item>행 클릭 → 케이스 상세</Item>
        <Item>우측 상단 CTA: 새 케이스(Primary)</Item>
      </Interactions>
    </Screen>

    <Screen number="7.4" id="case-create" title="새 케이스 생성(4-Step)">
      <Flow id="create-case" steps="4">
        <Step order="1" title="기본정보">
          <RequiredInputs>
            <Field name="성별" type="select" required="true">
              <Options>
                <Option>남</Option>
                <Option>여</Option>
                <Option>기타</Option>
                <Option>미상</Option>
              </Options>
            </Field>
            <Field name="연령대" type="select" required="true">
              <Options>
                <Option>0–9</Option>
                <Option>10–19</Option>
                <Option>20–29</Option>
                <Option>30–39</Option>
                <Option>40–49</Option>
                <Option>50–59</Option>
                <Option>60–69</Option>
                <Option>70–79</Option>
                <Option>80+</Option>
              </Options>
            </Field>
            <Field name="주호소" type="short-text" required="true" note="1줄">
              <Example>흉통</Example>
              <Example>두통</Example>
            </Field>
          </RequiredInputs>
          <OptionalInputs>
            <Field>내원경로/증상 시작일</Field>
            <Field>과거력</Field>
            <Field>복용약</Field>
            <Field>알레르기(태그 입력)</Field>
          </OptionalInputs>
        </Step>

        <Step order="2" title="문진(Questionnaire)">
          <Rules>
            <Rule>질문은 카드 1개=질문 1개(모바일 가독성)</Rule>
            <Rule>질문 타입: 단일선택/다중선택/척도(0–10)/자유서술</Rule>
            <Rule>“모름/해당없음” 선택 가능(강제 응답 최소화)</Rule>
          </Rules>
        </Step>

        <Step order="3" title="자료첨부(Upload)">
          <Components>
            <Item>파일 업로드(5.12)</Item>
            <InfoBanner>개인식별정보(주민번호 등)는 업로드하지 마세요.</InfoBanner>
          </Components>
        </Step>

        <Step order="4" title="확인/AI 요청(Review)">
          <Components>
            <Item>입력 요약 카드(수정 링크 포함)</Item>
            <Buttons>
              <Button variant="primary">AI 분석 요청</Button>
              <Button variant="outline" optional="true">임시저장</Button>
            </Buttons>
          </Components>
        </Step>
      </Flow>
      <ValidationRules>
        <Rule>필수 3항목(성별/연령대/주호소) 누락 시 Step 이동 불가</Rule>
        <Rule>업로드 파일은 선택이지만, 업로드 실패 파일이 있으면 요청 버튼 비활성 + 오류 안내</Rule>
      </ValidationRules>
    </Screen>

    <Screen number="7.5" id="processing-screen" title="AI 분석 진행(Processing Screen)">
      <Purpose>비동기 분석 과정의 불확실성 최소화.</Purpose>
      <Components>
        <Item>진행상태 컴포넌트(5.13)</Item>
        <Item optional="true">예상 소요시간(가능하면): “약 20–60초”</Item>
        <Buttons>
          <Button variant="outline">백그라운드로 보내기(케이스 목록으로 이동, 상태는 유지)</Button>
          <Button variant="outline" condition="onFailureOnly">재시도</Button>
        </Buttons>
      </Components>
    </Screen>

    <Screen number="7.6" id="analysis-result" title="결과 화면(Analysis Result)">
      <Layout>
        <Block order="1" title="상단 Summary Card(고정 구성)">
          <Item>위험도 배지 + 점수(옵션)</Item>
          <Item>한 줄 결론(예: “응급 가능성 있음(참고)”)</Item>
          <Item>신뢰 정보: 분석 시각, AI 버전, 입력 데이터 요약(토글)</Item>
          <Item>주요 CTA: PDF 내보내기 또는 공유 링크 생성(Primary 1개만)</Item>
        </Block>
        <Block order="2" title="상세 영역(탭 또는 아코디언)">
          <SectionName>요약(Summary)</SectionName>
          <SectionName>근거/관찰 포인트(Key Factors)</SectionName>
          <SectionName>권고사항(Next Steps)</SectionName>
          <SectionName>한계/주의사항(Disclosure) — 항상 노출</SectionName>
        </Block>
      </Layout>
      <Interactions>
        <Item>섹션별 “복사” 버튼(클립보드)</Item>
        <Item optional="true">“추가 질문하기”: 동일 케이스에 추가 입력 → 재분석(버전 증가)</Item>
      </Interactions>
      <Disclaimer required="true">본 결과는 참고용이며 최종 판단은 의료 전문가의 진료를 통해 이루어져야 합니다.</Disclaimer>
    </Screen>

    <Screen number="7.7" id="case-detail" title="케이스 상세(Case Detail)">
      <Purpose>케이스 단위의 히스토리/협업.</Purpose>
      <Components>
        <Item>좌(또는 상단): 케이스 요약 카드(필수 정보 + 상태/위험도)</Item>
        <Item>우(또는 하단): 타임라인</Item>
      </Components>
      <Timeline>
        <Event>입력 이벤트(문진/업로드)</Event>
        <Event>분석 요청/완료/실패 로그</Event>
        <Event>결과 스냅샷(버전별)</Event>
        <Event>사용자 메모(의료진/상담사)</Event>
      </Timeline>
      <Actions>
        <Action>상태 변경(대기→완료)</Action>
        <Action optional="true">담당자 지정</Action>
      </Actions>
    </Screen>

    <Screen number="7.8" id="admin-settings" title="설정(관리자) — AI 연동/사용자/로그">
      <SubScreen id="ai-integration" title="AI 연동 설정">
        <Fields>
          <Field>API Base URL</Field>
          <Field>API Key(마스킹 기본, “보기”는 재인증 필요 권장)</Field>
          <Field optional="true">모델/버전 선택(옵션)</Field>
          <Field>Timeout(초)</Field>
        </Fields>
        <Buttons>
          <Button variant="outline">연결 테스트(성공/실패 토스트)</Button>
          <Button variant="primary">저장</Button>
        </Buttons>
      </SubScreen>
      <SubScreen id="users-permissions" title="사용자/권한">
        <Roles>
          <Role>Admin</Role>
          <Role>Clinician(의료진)</Role>
          <Role>Staff(상담사)</Role>
          <Role>Viewer(읽기 전용)</Role>
        </Roles>
        <PermissionExamples>
          <Permission>케이스 생성/조회/다운로드</Permission>
          <Permission>설정 접근</Permission>
          <Permission>민감정보 보기(마스킹 해제)</Permission>
        </PermissionExamples>
      </SubScreen>
      <SubScreen id="audit-log" title="감사 로그(접근 기록)">
        <RequiredColumns>
          <Column>사용자</Column>
          <Column>작업(조회/다운로드/공유)</Column>
          <Column>케이스ID</Column>
          <Column>일시</Column>
          <Column optional="true">IP</Column>
        </RequiredColumns>
        <Filters>
          <Filter>사용자</Filter>
          <Filter>기간</Filter>
          <Filter>작업 유형</Filter>
        </Filters>
      </SubScreen>
    </Screen>
  </Section>

  <Section number="8" id="copy-tone" title="문구/표현 규칙(의료 AI 톤)">
    <CopyRules>
      <ForbiddenPhrases>
        <Phrase>확정 진단</Phrase>
        <Phrase>처방</Phrase>
        <Phrase>반드시</Phrase>
        <Phrase>100%</Phrase>
      </ForbiddenPhrases>
      <RecommendedPhrases>
        <Phrase>가능성</Phrase>
        <Phrase>의심</Phrase>
        <Phrase>참고</Phrase>
        <Phrase>추가 확인 권장</Phrase>
      </RecommendedPhrases>
      <AnxietyReduction>
        <Rule>High 위험도에서는 “행동 지침”을 명확히(예: “증상이 심하면 즉시 응급실/119”)</Rule>
        <Rule>Medium/Low에서는 “관찰 포인트/추가 질문” 중심</Rule>
      </AnxietyReduction>
    </CopyRules>
  </Section>

  <Section number="9" id="accessibility" title="접근성(A11y) &amp; 품질 기준">
    <A11yQualityRules>
      <Rule>대비(Contrast): 텍스트 대비 WCAG AA 수준(일반 텍스트 4.5:1 권장)</Rule>
      <Rule>키보드: Tab 이동 순서 논리적, 모든 버튼/입력 접근 가능</Rule>
      <Rule>스크린리더: 폼 라벨 연결, 오류는 aria-live(중요 오류)</Rule>
      <Rule>색상만으로 의미 전달 금지: 위험도는 텍스트(Low/Medium/High) 동반</Rule>
      <Rule>날짜/시간 표기: YYYY-MM-DD HH:mm(24h) 기본(로그/의료 기록에 유리)</Rule>
    </A11yQualityRules>
  </Section>

  <Section number="10" id="dev-guide" title="개발 구현 가이드(프론트/백엔드 협업 포인트)">
    <SubSection number="10.1" id="mvp-priority" title="화면 구현 우선순위(MVP)">
      <PriorityList>
        <Item order="1">로그인/권한</Item>
        <Item order="2">케이스 목록 + 상세</Item>
        <Item order="3">새 케이스(4-Step) + 업로드</Item>
        <Item order="4">AI 진행상태 + 결과 화면</Item>
        <Item order="5">설정(최소: AI 연동 테스트/저장)</Item>
      </PriorityList>
    </SubSection>

    <SubSection number="10.2" id="api-fields" title="API 응답에 포함되면 UX가 좋아지는 필드(권장)">
      <ApiEntities>
        <Entity name="case">
          <Field required="true">id</Field>
          <Field required="true">status</Field>
          <Field required="true">risk_level</Field>
          <Field optional="true">risk_score</Field>
          <Field required="true">created_at</Field>
          <Field required="true">updated_at</Field>
          <Field required="true">patient_summary(성별/연령대/주호소 1줄)</Field>
          <Field optional="true">assigned_to</Field>
        </Entity>
        <Entity name="analysis">
          <Field required="true">analysis_id</Field>
          <Field required="true">model_name</Field>
          <Field required="true">model_version</Field>
          <Field required="true">started_at</Field>
          <Field required="true">finished_at</Field>
          <Field optional="true">confidence(0–1 또는 low/med/high)</Field>
          <Field required="true">summary</Field>
          <Field required="true">key_factors[]</Field>
          <Field required="true">recommendations[]</Field>
          <Field required="true">disclaimer</Field>
          <Field required="true">errors[](실패 시 사용자 노출용 메시지 포함)</Field>
        </Entity>
      </ApiEntities>
    </SubSection>

    <SubSection number="10.3" id="async-status-codes" title="비동기 UX를 위한 상태 코드(권장)">
      <StatusCodes>
        <SuccessFlow>QUEUED → PREPROCESSING → ANALYZING → GENERATING → COMPLETED</SuccessFlow>
        <Failure>FAILED(사유 코드 포함: TIMEOUT/INVALID_INPUT/UPSTREAM_ERROR)</Failure>
      </StatusCodes>
    </SubSection>
  </Section>

  <Section number="11" id="release-checklist" title="체크리스트(출시 전)">
    <Checklist>
      <Item checked="false">결과 화면에 고지(Disclaimer) 고정 노출</Item>
      <Item checked="false">모든 폼 필드: 라벨/오류/포커스 상태 구현</Item>
      <Item checked="false">모바일에서 테이블 → 카드 리스트로 변환 확인</Item>
      <Item checked="false">세션 만료 시 재로그인 플로우 정상 동작</Item>
      <Item checked="false">파일 업로드 실패/재시도 UX 확인</Item>
      <Item checked="false">AI 연동 실패 시 사용자 메시지(기술용어 최소화) 적용</Item>
    </Checklist>
  </Section>
</UiUxSpec>
```
