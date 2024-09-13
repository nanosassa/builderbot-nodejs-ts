import { Configuration, OpenAIApi }  from 'openai'

// Historial de mensajes (puede ser global o específico por sesión del usuario)
let conversationHistory = [];

const chat = async (prompt, text) => {
    try {
        const configuration = new Configuration({
            apiKey: process.env.OPENAI_API_KEY,
        });
        const openai = new OpenAIApi(configuration);

        // Si es la primera vez, inicializa con el mensaje del sistema (el prompt)
        if (conversationHistory.length === 0) {
            conversationHistory.push({ role: "system", content: prompt });
        }

        // Agrega el mensaje del usuario al historial
        conversationHistory.push({ role: "user", content: text });

        // Envía toda la conversación (incluyendo el historial) a la API
        const completion = await openai.createChatCompletion({
            model: "gpt-4o-mini",
            messages: conversationHistory,
        });

        // Obtener la respuesta de la IA
        const responseMessage = completion.data.choices[0].message;

        // Agrega la respuesta de la IA al historial
        conversationHistory.push(responseMessage);

        // Devuelve la respuesta de la IA
        return responseMessage;
    } catch (err) {
        console.error("Error al conectar con OpenAI:", err);
        return "ERROR";
    }
};

export default chat;
