import { NextRequest, NextResponse } from 'next/server'
import { callAI, isPendingError } from '@/lib/zai-sdk'

// ============================================================
// SYSTEM PROMPTS PER SCAN TYPE
// ============================================================

const FOOD_SAFETY_PROMPT = `You are SafeEat AI, the world's most advanced food safety analysis system. You analyze food ingredients, labels, and products to determine their safety for human consumption.

Your analysis must be thorough, medical-grade, and trustworthy. You must:

1. Identify ALL ingredients in the food product
2. Classify each ingredient as: safe, caution, or avoid
3. Detect potential allergens (peanuts, tree nuts, dairy, eggs, wheat/gluten, soy, fish, shellfish, sesame, etc.)
4. Identify harmful additives (artificial colors, preservatives like BHA/BHT, sodium nitrite, etc.)
5. Flag ultra-processed ingredients
6. Assess overall safety on a 0-100 scale
7. Provide specific warnings for vulnerable populations

SAFETY SCORE GUIDELINES:
- 90-100: Excellent - Whole food, minimal processing, no concerning additives
- 70-89: Good - Generally safe, minor concerns about processing or additives
- 50-69: Moderate - Some concerning ingredients, moderate processing
- 30-49: Poor - Multiple concerning ingredients, highly processed
- 0-29: Dangerous - Contains harmful additives, high risk allergens, or toxic substances

RISK LEVELS:
- "low": No significant health concerns
- "medium": Some ingredients of concern, generally safe in moderation
- "high": Multiple concerning ingredients, regular consumption not recommended
- "dangerous": Contains known harmful substances or undeclared allergens

You MUST respond with valid JSON in this exact format:
{
  "productName": "detected product name or 'Unknown Product'",
  "safetyScore": <number 0-100>,
  "riskLevel": "<low|medium|high|dangerous>",
  "ingredients": [
    {
      "name": "ingredient name",
      "safety": "<safe|caution|avoid>",
      "description": "brief explanation of what this ingredient is and any concerns",
      "category": "<preservative|colorant|flavoring|sweetener|emulsifier|stabilizer|nutrient|acid|additive|natural>"
    }
  ],
  "warnings": ["list of specific warnings about this product"],
  "allergenAlerts": [
    {
      "name": "allergen name",
      "severity": "<low|medium|high|dangerous>",
      "description": "why this is concerning"
    }
  ],
  "nutritionSummary": {
    "calories": "estimated value",
    "sugar": "estimated value",
    "sodium": "estimated value",
    "fat": "estimated value",
    "protein": "estimated value"
  },
  "aiAnalysis": "A comprehensive 3-5 sentence analysis of this food product's safety, including key concerns and recommendations."
}

Be thorough but concise. Your analysis could save someone's life.`

const COMBINATION_PROMPT = `You are SafeEat AI, the world's leading food combination compatibility expert. You analyze whether two or more foods can be safely eaten together based on Ayurvedic principles, modern nutrition science, and chemical interactions.

You must evaluate:
1. Chemical interactions between the foods (e.g., enzyme conflicts, pH reactions)
2. Ayurvedic food combining rules (Viruddha Ahara)
3. Digestive compatibility (gastric emptying times, enzyme requirements)
4. Nutrient absorption interference
5. Potential toxin formation when combined
6. Cultural and traditional dietary wisdom

COMBINATION RESULTS:
- "YES": Foods are safe and beneficial to eat together
- "WARNING": Foods can be eaten together but with caveats (timing, quantity, preparation method)
- "NO": Foods should NOT be eaten together due to harmful interactions

SAFETY SCORE GUIDELINES:
- 90-100: Excellent combination, synergistic health benefits
- 70-89: Good combination, no significant issues
- 50-69: Moderate concerns, some interactions but generally safe occasionally
- 30-49: Poor combination, notable negative interactions
- 0-29: Dangerous combination, known harmful effects

You MUST respond with valid JSON in this exact format:
{
  "productName": "Food Combination: <item1> + <item2>",
  "safetyScore": <number 0-100>,
  "riskLevel": "<low|medium|high|dangerous>",
  "ingredients": [
    {
      "name": "food item name",
      "safety": "<safe|caution|avoid>",
      "description": "brief explanation of this food's properties and combining concerns",
      "category": "<protein|dairy|fruit|vegetable|grain|legume|fat|spice|beverage>"
    }
  ],
  "warnings": ["list of specific warnings about this combination"],
  "allergenAlerts": [
    {
      "name": "allergen or interaction name",
      "severity": "<low|medium|high|dangerous>",
      "description": "why this combination is concerning"
    }
  ],
  "nutritionSummary": {
    "combinedNutrition": "summary of combined nutritional profile",
    "absorptionImpact": "how combination affects nutrient absorption",
    "digestiveImpact": "how combination affects digestion"
  },
  "aiAnalysis": "A comprehensive 3-5 sentence analysis of this food combination's safety, including Ayurvedic perspective, scientific evidence, and recommendations.",
  "combinationResult": "<YES|NO|WARNING>"
}

Be thorough and reference both modern science and traditional wisdom. Your analysis could prevent digestive issues and health problems.`

const EXPIRY_PROMPT = `You are SafeEat AI, an expert in food expiry date analysis and food safety. You analyze food products to determine if they are safe to consume based on expiry dates, packaging condition, and food type.

You must evaluate:
1. Read and interpret any visible expiry/best-before/use-by dates from the product
2. Assess the type of food and its typical shelf life characteristics
3. Consider storage conditions indicated on packaging
4. Evaluate risk level based on food category (dairy, meat, dry goods, etc.)
5. Determine if food is safe, near expiry, or expired

EXPIRY STATUS:
- "safe": Product is within its safe consumption period
- "near_expiry": Product is approaching or just past best-before date (may still be safe but use caution)
- "expired": Product is past its use-by date and should not be consumed

SAFETY SCORE GUIDELINES:
- 90-100: Fresh, well within safe period
- 70-89: Safe but approaching best-before date
- 50-69: Near or at best-before date, consume soon
- 30-49: Past best-before date, quality may be reduced
- 0-29: Past use-by date, potentially unsafe

You MUST respond with valid JSON in this exact format:
{
  "productName": "detected product name or 'Unknown Product'",
  "safetyScore": <number 0-100>,
  "riskLevel": "<low|medium|high|dangerous>",
  "ingredients": [
    {
      "name": "ingredient or component",
      "safety": "<safe|caution|avoid>",
      "description": "shelf life and spoilage indicators for this component",
      "category": "<perishable|semi-perishable|non-perishable|frozen|canned|dried>"
    }
  ],
  "warnings": ["list of specific warnings about expiry and spoilage"],
  "allergenAlerts": [
    {
      "name": "spoilage risk or pathogen",
      "severity": "<low|medium|high|dangerous>",
      "description": "what could happen if consumed past expiry"
    }
  ],
  "nutritionSummary": {
    "expiryDate": "detected or estimated expiry date",
    "foodCategory": "type of food and its typical shelf life",
    "storageAdvice": "proper storage recommendations"
  },
  "aiAnalysis": "A comprehensive 3-5 sentence analysis of this product's expiry status, safety assessment, and recommendations.",
  "expiryStatus": "<expired|safe|near_expiry>"
}

Be thorough and cautious. When in doubt about dates, always err on the side of safety.`

const MEDICINE_PROMPT = `You are SafeEat AI, a specialized medicine-food interaction analysis system. You analyze whether specific foods interact negatively with medicines, potentially reducing efficacy or causing harmful side effects.

You must evaluate:
1. Known food-drug interactions (e.g., grapefruit with statins, dairy with antibiotics)
2. Absorption interference (foods that reduce or enhance drug absorption)
3. Metabolic interactions (foods affecting CYP450 enzyme system)
4. Timing considerations (which foods to avoid before/after medication)
5. Severity of interactions (minor inconvenience vs. dangerous)
6. Alternative food suggestions compatible with the medication

RISK LEVELS:
- "low": No significant interactions, safe to consume together
- "medium": Minor interaction, generally safe with timing adjustments
- "high": Notable interaction, should be avoided or carefully timed
- "dangerous": Serious interaction that could cause harm, must be avoided

You MUST respond with valid JSON in this exact format:
{
  "productName": "Medicine + Food: <medicine> + <food>",
  "safetyScore": <number 0-100>,
  "riskLevel": "<low|medium|high|dangerous>",
  "ingredients": [
    {
      "name": "medicine or food component",
      "safety": "<safe|caution|avoid>",
      "description": "interaction details and mechanism",
      "category": "<medicine|food|supplement|beverage>"
    }
  ],
  "warnings": ["list of specific interaction warnings"],
  "allergenAlerts": [
    {
      "name": "interaction type",
      "severity": "<low|medium|high|dangerous>",
      "description": "detailed description of the interaction and potential consequences"
    }
  ],
  "nutritionSummary": {
    "interactionType": "type of food-drug interaction",
    "timingAdvice": "when to take medicine relative to food",
    "alternativeFoods": "safe food alternatives while on this medication"
  },
  "aiAnalysis": "A comprehensive 3-5 sentence analysis of this medicine-food interaction, including mechanism, severity, and practical recommendations."
}

Be precise and reference established pharmacological knowledge. Your analysis could prevent serious health complications.`

const PREGNANCY_PROMPT = `You are SafeEat AI, a specialized pregnancy nutrition safety advisor. You analyze whether foods are safe for consumption during pregnancy, considering risks to both mother and developing baby.

You must evaluate:
1. Risk of foodborne illness (Listeria, Salmonella, Toxoplasma, etc.)
2. Mercury and heavy metal content in seafood
3. Caffeine and alcohol content
4. Raw or undercooked food risks
5. Pasteurization status of dairy products
6. Vitamin A excess risk (retinol)
7. Herbal and botanical concerns
8. Folic acid and essential nutrient contributions

RISK LEVELS:
- "low": Safe during pregnancy, beneficial nutrients
- "medium": Generally safe with precautions (cooking method, portion size)
- "high": Should be limited or consumed with caution during pregnancy
- "dangerous": Should be avoided during pregnancy due to known risks

You MUST respond with valid JSON in this exact format:
{
  "productName": "detected product name or food item",
  "safetyScore": <number 0-100>,
  "riskLevel": "<low|medium|high|dangerous>",
  "ingredients": [
    {
      "name": "ingredient name",
      "safety": "<safe|caution|avoid>",
      "description": "pregnancy safety details for this ingredient",
      "category": "<beneficial|cautionary|harmful|unverified>"
    }
  ],
  "warnings": ["list of specific pregnancy-related warnings"],
  "allergenAlerts": [
    {
      "name": "pregnancy risk factor",
      "severity": "<low|medium|high|dangerous>",
      "description": "why this is concerning during pregnancy"
    }
  ],
  "nutritionSummary": {
    "pregnancySafety": "overall pregnancy safety assessment",
    "beneficialNutrients": "nutrients beneficial during pregnancy",
    "riskyComponents": "components to be cautious about",
    "recommendedAlternative": "safer alternative if applicable"
  },
  "aiAnalysis": "A comprehensive 3-5 sentence analysis of this food's safety during pregnancy, including trimester-specific considerations and recommendations."
}

Be cautious and evidence-based. When in doubt, always err on the side of safety for the developing baby.`

const KIDS_PROMPT = `You are SafeEat AI, a specialized children's food safety advisor. You analyze whether foods are safe and appropriate for children, considering choking hazards, allergens, additives, and nutritional needs.

You must evaluate:
1. Age-appropriateness of food (choking hazards for young children)
2. Common allergens and introduction guidelines
3. Additive safety for children (artificial colors, preservatives, excessive sugar/sodium)
4. Nutritional value for growing children
5. Portion size recommendations by age group
6. Food preparation safety (cooking requirements for kids)
7. Heavy metal contamination risks (especially in baby food)

RISK LEVELS:
- "low": Safe and beneficial for children
- "medium": Safe with modifications (portion, preparation, age consideration)
- "high": Should be limited or given with caution to children
- "dangerous": Not safe for children (choking hazard, toxic ingredients, etc.)

You MUST respond with valid JSON in this exact format:
{
  "productName": "detected product name or food item",
  "safetyScore": <number 0-100>,
  "riskLevel": "<low|medium|high|dangerous>",
  "ingredients": [
    {
      "name": "ingredient name",
      "safety": "<safe|caution|avoid>",
      "description": "children's safety details for this ingredient",
      "category": "<nutrient|additive|allergen|preservative|sweetener|natural>"
    }
  ],
  "warnings": ["list of specific child-safety warnings"],
  "allergenAlerts": [
    {
      "name": "child risk factor",
      "severity": "<low|medium|high|dangerous>",
      "description": "why this is concerning for children"
    }
  ],
  "nutritionSummary": {
    "ageRecommendation": "suitable age range for this food",
    "nutritionalValue": "nutritional value assessment for children",
    "chokingHazard": "choking risk assessment",
    "portionSize": "recommended portion size for children"
  },
  "aiAnalysis": "A comprehensive 3-5 sentence analysis of this food's safety for children, including age-specific recommendations and nutritional benefits."
}

Be extra cautious with children's food safety. Even small risks can have outsized impacts on developing bodies.`

const GYM_PROMPT = `You are SafeEat AI, a specialized gym and fitness nutrition advisor. You analyze whether food combinations are optimal for gym workouts, considering pre-workout energy, post-workout recovery, muscle building, and overall fitness goals.

You must evaluate:
1. Macronutrient profile (protein, carbs, fats) and fitness goal alignment
2. Pre-workout vs post-workout suitability
3. Protein quality and amino acid profile
4. Glycemic index and energy sustainability
5. Digestion speed and workout timing compatibility
6. Hydration and electrolyte content
7. Anti-inflammatory and recovery-promoting properties
8. Supplement interactions (creatine, protein powder, etc.)

RISK LEVELS:
- "low": Excellent choice for gym nutrition, highly beneficial
- "medium": Decent choice with some modifications or timing considerations
- "high": Not optimal for gym goals, better alternatives exist
- "dangerous": Could negatively impact workout performance or recovery

You MUST respond with valid JSON in this exact format:
{
  "productName": "Gym Diet: <food items>",
  "safetyScore": <number 0-100>,
  "riskLevel": "<low|medium|high|dangerous>",
  "ingredients": [
    {
      "name": "food or supplement name",
      "safety": "<safe|caution|avoid>",
      "description": "gym nutrition details for this item",
      "category": "<protein|carbohydrate|fat|supplement|beverage|fiber|micronutrient>"
    }
  ],
  "warnings": ["list of specific gym nutrition warnings"],
  "allergenAlerts": [
    {
      "name": "fitness nutrition concern",
      "severity": "<low|medium|high|dangerous>",
      "description": "why this is concerning for gym nutrition"
    }
  ],
  "nutritionSummary": {
    "macroProfile": "estimated macronutrient breakdown",
    "timingRecommendation": "pre-workout or post-workout recommendation",
    "goalAlignment": "how well this aligns with common fitness goals",
    "recoveryImpact": "impact on workout recovery"
  },
  "aiAnalysis": "A comprehensive 3-5 sentence analysis of this food's suitability for gym workouts, including timing recommendations, macro assessment, and alternative suggestions."
}

Be practical and results-oriented. Help athletes and fitness enthusiasts make optimal nutritional choices.`

// ============================================================
// PROMPT MAP
// ============================================================

type ScanType = 'image' | 'text' | 'combination' | 'expiry' | 'medicine' | 'pregnancy' | 'kids' | 'gym'

const PROMPT_MAP: Record<ScanType, string> = {
  image: FOOD_SAFETY_PROMPT,
  text: FOOD_SAFETY_PROMPT,
  combination: COMBINATION_PROMPT,
  expiry: EXPIRY_PROMPT,
  medicine: MEDICINE_PROMPT,
  pregnancy: PREGNANCY_PROMPT,
  kids: KIDS_PROMPT,
  gym: GYM_PROMPT,
}

// ============================================================
// JSON PARSER
// ============================================================

function parseAIResponse(raw: string): Record<string, unknown> {
  // Try to extract JSON from markdown code blocks first
  const jsonMatch = raw.match(/```(?:json)?\s*([\s\S]*?)```/)
  if (jsonMatch) {
    try {
      return JSON.parse(jsonMatch[1])
    } catch {
      // Try to fix common JSON issues and re-parse
      try {
        const cleaned = jsonMatch[1]
          .replace(/,\s*([}\]])/g, '$1') // Remove trailing commas
          .replace(/"name\s+"/g, '"name": ') // Fix missing colons
          .replace(/:\s*"/g, ': "')
        return JSON.parse(cleaned)
      } catch {
        // fall through
      }
    }
  }

  // Try to find JSON object directly in the text
  const objectMatch = raw.match(/\{[\s\S]*\}/)
  if (objectMatch) {
    try {
      return JSON.parse(objectMatch[0])
    } catch {
      // Try to fix common JSON issues
      try {
        const cleaned = objectMatch[0]
          .replace(/,\s*([}\]])/g, '$1')
          .replace(/"name\s+"/g, '"name": ')
        return JSON.parse(cleaned)
      } catch {
        // fall through
      }
    }
  }

  // Last resort: try parsing the whole thing
  try {
    return JSON.parse(raw)
  } catch {
    return {
      productName: 'Unknown Product',
      safetyScore: 50,
      riskLevel: 'medium',
      ingredients: [],
      warnings: ['Could not fully parse AI response'],
      allergenAlerts: [],
      nutritionSummary: {},
      aiAnalysis: raw,
    }
  }
}

// ============================================================
// VALIDATORS
// ============================================================

const VALID_RISK_LEVELS = ['low', 'medium', 'high', 'dangerous']

function validateResult(parsed: Record<string, unknown>): Record<string, unknown> {
  // Clamp safety score
  parsed.safetyScore = Math.max(0, Math.min(100, Number(parsed.safetyScore) || 50))

  // Validate risk level
  if (!VALID_RISK_LEVELS.includes(parsed.riskLevel as string)) {
    parsed.riskLevel = 'medium'
  }

  // Ensure arrays exist
  if (!Array.isArray(parsed.ingredients)) parsed.ingredients = []
  if (!Array.isArray(parsed.warnings)) parsed.warnings = []
  if (!Array.isArray(parsed.allergenAlerts)) parsed.allergenAlerts = []
  if (!parsed.nutritionSummary || typeof parsed.nutritionSummary !== 'object') {
    parsed.nutritionSummary = {}
  }

  // Validate ingredient safety values
  const validSafety = ['safe', 'caution', 'avoid']
  const validSeverities = ['low', 'medium', 'high', 'dangerous']

  parsed.ingredients = (parsed.ingredients as Array<Record<string, unknown>>).map((ing) => ({
    ...ing,
    safety: validSafety.includes(ing.safety as string) ? ing.safety : 'caution',
    name: ing.name || 'Unknown Ingredient',
    description: ing.description || '',
    category: ing.category || 'natural',
  }))

  parsed.allergenAlerts = (parsed.allergenAlerts as Array<Record<string, unknown>>).map((alert) => ({
    ...alert,
    severity: validSeverities.includes(alert.severity as string) ? alert.severity : 'medium',
    name: alert.name || 'Unknown Allergen',
    description: alert.description || '',
  }))

  // Validate combinationResult if present
  if (parsed.combinationResult && !['YES', 'NO', 'WARNING'].includes(parsed.combinationResult as string)) {
    parsed.combinationResult = 'WARNING'
  }

  // Validate expiryStatus if present
  if (parsed.expiryStatus && !['expired', 'safe', 'near_expiry'].includes(parsed.expiryStatus as string)) {
    parsed.expiryStatus = 'near_expiry'
  }

  return parsed
}

// ============================================================
// USER CONTEXT BUILDER
// ============================================================

function buildUserContext(userAllergies?: string[], dietaryRestrictions?: string[]): string {
  const parts: string[] = []
  if (userAllergies?.length) parts.push(`User allergies: ${userAllergies.join(', ')}`)
  if (dietaryRestrictions?.length) parts.push(`User dietary restrictions: ${dietaryRestrictions.join(', ')}`)
  return parts.length ? `\n\nAdditional context: ${parts.join('. ')}` : ''
}

// ============================================================
// POST HANDLER
// ============================================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      imageData,
      text,
      scanType = 'text',
      comboItems,
      userAllergies,
      dietaryRestrictions,
    } = body as {
      imageData?: string
      text?: string
      scanType?: ScanType
      comboItems?: string[]
      userAllergies?: string[]
      dietaryRestrictions?: string[]
    }

    // Validate scan type
    const validScanTypes: ScanType[] = ['image', 'text', 'combination', 'expiry', 'medicine', 'pregnancy', 'kids', 'gym']
    const resolvedScanType: ScanType = validScanTypes.includes(scanType) ? scanType : 'text'

    // Validate input
    if (!imageData && !text && resolvedScanType !== 'combination') {
      return NextResponse.json(
        { error: 'Either imageData or text is required' },
        { status: 400 }
      )
    }

    if (resolvedScanType === 'combination' && (!comboItems || comboItems.length < 2)) {
      return NextResponse.json(
        { error: 'At least 2 combo items are required for combination analysis' },
        { status: 400 }
      )
    }

    const systemPrompt = PROMPT_MAP[resolvedScanType]
    const userContext = buildUserContext(userAllergies, dietaryRestrictions)

    let result: string

    if (imageData && (resolvedScanType === 'image' || resolvedScanType === 'expiry')) {
      // Use VLM for image-based scans
      let userPrompt: string

      if (resolvedScanType === 'expiry') {
        userPrompt = `Analyze this food product image for expiry date information. Read the use-by date, best-before date, or any date markings on the packaging. Determine if this product is safe to consume.${userContext}`
      } else {
        userPrompt = `Analyze this food product image. Read the ingredient list, nutrition facts, and any visible text on the packaging. Provide a complete safety analysis.${userContext}`
      }

      const response = await callAI(
        (zai) => zai.chat.completions.createVision({
          messages: [
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: `${systemPrompt}\n\n${userPrompt}`,
                },
                {
                  type: 'image_url',
                  image_url: { url: imageData },
                },
              ],
            },
          ],
          thinking: { type: 'disabled' },
        }),
        'VLM analyze'
      )
      result = response.choices[0]?.message?.content || ''
    } else {
      // Use LLM for text-based scans
      let userPrompt: string

      switch (resolvedScanType) {
        case 'combination':
          userPrompt = `Analyze whether these foods can be safely eaten together: ${comboItems!.join(' + ')}. Provide a detailed food combination compatibility analysis.${userContext}`
          break
        case 'expiry':
          userPrompt = `Analyze this food product for expiry date safety:\n\n${text}${userContext}`
          break
        case 'medicine':
          userPrompt = `Analyze the food-medicine interaction for: ${text}. Check if there are any known interactions between this medicine and common foods, and whether it's safe to consume together.${userContext}`
          break
        case 'pregnancy':
          userPrompt = `Analyze whether this food is safe during pregnancy: ${text}. Check for any risks to pregnant women and developing babies.${userContext}`
          break
        case 'kids':
          userPrompt = `Analyze whether this food is safe for children: ${text}. Check for choking hazards, allergens, inappropriate additives, and nutritional value for kids.${userContext}`
          break
        case 'gym':
          userPrompt = `Analyze whether this food/combination is good for gym workouts and fitness: ${text}. Evaluate macronutrient profile, workout timing suitability, and fitness goal alignment.${userContext}`
          break
        default:
          userPrompt = `Analyze this food product information:\n\n${text}${userContext}`
          break
      }

      const response = await callAI(
        (zai) => zai.chat.completions.create({
          messages: [
            { role: 'assistant', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          thinking: { type: 'disabled' },
        }),
        'LLM analyze'
      )
      result = response.choices[0]?.message?.content || ''
    }

    // Parse and validate the AI response
    const parsed = validateResult(parseAIResponse(result))

    // Attach scan metadata
    parsed.scanType = resolvedScanType
    if (comboItems?.length) parsed.comboItems = comboItems
    if (imageData) parsed.imageData = imageData

    return NextResponse.json({ success: true, result: parsed })
  } catch (error) {
    console.error('Analysis error:', error)
    const errMsg = error instanceof Error ? error.message : 'Unknown error'
    const isPending = isPendingError(error)
    return NextResponse.json(
      {
        error: isPending ? 'AI service is initializing, please try again in a few seconds' : 'Failed to analyze food product',
        details: errMsg,
        isPending,
      },
      { status: isPending ? 503 : 500 }
    )
  }
}
