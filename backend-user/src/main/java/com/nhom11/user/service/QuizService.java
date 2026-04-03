package com.nhom11.user.service;

import com.nhom11.user.dto.*;
import com.nhom11.user.model.*;
import com.nhom11.user.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class QuizService {

    @Autowired
    private QuizRepository quizRepository;

    @Autowired
    private QuizHistoryRepository historyRepository;

    @Autowired
    private QuizAnswerRepository answerRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private VocabCategoryRepository categoryRepository;

    // 🎯 Lấy quiz (ẩn đáp án)
    public List<QuizResponse> getQuiz(Long categoryId) {

        List<Quiz> quizzes =
                quizRepository.findByVocabulary_Category_CategoryId(categoryId);

        Collections.shuffle(quizzes);

        return quizzes.stream()
                .limit(10)
                .map(q -> {
                    QuizResponse res = new QuizResponse();
                    res.setQuizId(q.getQuizId());
                    res.setQuestion(q.getQuestion());
                    res.setOptionA(q.getOptionA());
                    res.setOptionB(q.getOptionB());
                    res.setOptionC(q.getOptionC());
                    res.setOptionD(q.getOptionD());
                    return res;
                })
                .collect(Collectors.toList());
    }

    // 🎯 Submit quiz
    public QuizHistory submitQuiz(QuizSubmitRequest request) {

        // 🔐 lấy user từ JWT (CHUẨN THỰC TẾ)
        String username = SecurityContextHolder.getContext()
                .getAuthentication().getName();

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + request.getUserId()));
        VocabCategory category =
                categoryRepository.findById(request.getCategoryId()).orElseThrow();

        QuizHistory history = new QuizHistory();
        history.setUser(user);
        history.setCategory(category);
        history.setTotalQuestions(request.getAnswers().size());

        history = historyRepository.save(history);

        int correct = 0;
        List<QuizAnswer> savedAnswers = new ArrayList<>(); // List tạm để hứng dữ liệu
        for (AnswerRequest ans : request.getAnswers()) {

            Quiz quiz = quizRepository.findById(ans.getQuizId()).orElseThrow();

            boolean isCorrect =
                    quiz.getCorrectOption().equalsIgnoreCase(ans.getSelectedOption());

            if (isCorrect) correct++;

            QuizAnswer qa = new QuizAnswer();
            qa.setHistory(history);
            qa.setQuiz(quiz);
            qa.setSelectedOption(ans.getSelectedOption());
            qa.setIsCorrect(isCorrect);

            savedAnswers.add(answerRepository.save(qa));
        }
        history.setAnswers(savedAnswers); // Gán list đã lưu vào đây để trả về JSON không bị null
        history.setCorrectAnswers(correct);
        history.setScore((double) correct / request.getAnswers().size() * 10);

        return historyRepository.save(history);
    }
}